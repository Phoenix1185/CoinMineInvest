import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, AlertTriangle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface MiningPlan {
  id: number;
  name: string;
  price: string;
  miningRate: string;
  dailyEarnings: string;
  monthlyRoi: string;
  contractPeriod: number;
}

interface PaymentModalProps {
  plan: MiningPlan;
  isOpen: boolean;
  onClose: () => void;
}

// Base crypto options with static data (addresses and logos)
const CRYPTO_OPTIONS = [
  {
    symbol: "BNB",
    name: "Binance Coin", 
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    address: "0x09f616C4118870CcB2BE1aCE1EAc090bF443833B",
  },
  {
    symbol: "BTC", 
    name: "Bitcoin",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    address: "bc1qfxl02mlrwfnnamr6qqhcgcutyth87du67u0nm0",
  },
  {
    symbol: "USDT",
    name: "Tether", 
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png", 
    address: "TDsBManQwvT698thSMKmhjYqKTupVxWFwK",
  },
  {
    symbol: "SOL",
    name: "Solana",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    address: "9ENQmbQFA1mKWYZWaL1qpH1ACLioLz55eANsigHGckXt",
  },
];

// Interface for crypto price data
interface CryptoPrice {
  id: number;
  symbol: string;
  name: string;
  price: string;
  change1h: string;
  change24h: string;
  change7d: string;
  marketCap: string;
  volume24h: string;
  circulatingSupply: string;
  logoUrl: string;
  updatedAt: string;
}

export default function PaymentModal({ plan, isOpen, onClose }: PaymentModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<typeof CRYPTO_OPTIONS[0] | null>(null);
  const [transactionHash, setTransactionHash] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real-time crypto prices
  const { data: cryptoPrices = [] } = useQuery<CryptoPrice[]>({
    queryKey: ["/api/crypto-prices"],
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted and is pending approval. You will be notified once it's processed.",
      });
      onClose();
      setTransactionHash("");
      setSelectedCrypto(null);
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized", 
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get real-time price for a crypto symbol
  const getRealTimePrice = (symbol: string): number => {
    const cryptoPrice = cryptoPrices.find(p => p.symbol === symbol);
    return cryptoPrice ? parseFloat(cryptoPrice.price) : 0;
  };

  const calculateCryptoAmount = (crypto: typeof CRYPTO_OPTIONS[0]) => {
    const usdAmount = parseFloat(plan.price);
    const realTimeRate = getRealTimePrice(crypto.symbol);
    
    // Fallback to 0 if no real-time price available (will show error)
    if (realTimeRate === 0) {
      return "0.00000000";
    }
    
    const cryptoAmount = usdAmount / realTimeRate;
    return cryptoAmount.toFixed(crypto.symbol === "BTC" ? 8 : crypto.symbol === "USDT" ? 2 : 4);
  };

  // Create enhanced crypto options with real-time prices
  const enhancedCryptoOptions = CRYPTO_OPTIONS.map(crypto => ({
    ...crypto,
    rate: getRealTimePrice(crypto.symbol),
    isAvailable: getRealTimePrice(crypto.symbol) > 0
  }));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const handleSubmitPayment = () => {
    if (!selectedCrypto || !transactionHash.trim()) {
      toast({
        title: "Error",
        description: "Please select a payment method and enter a transaction hash",
        variant: "destructive",
      });
      return;
    }

    const cryptoAmount = calculateCryptoAmount(selectedCrypto);

    createTransactionMutation.mutate({
      planId: plan.id,
      currency: selectedCrypto.symbol,
      cryptoAmount: parseFloat(cryptoAmount),
      walletAddress: selectedCrypto.address,
      transactionHash: transactionHash.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cmc-card border-gray-700 max-w-2xl" data-testid="modal-payment">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl" data-testid="text-modal-title">
            Complete Payment - {plan.name} Plan
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white" data-testid="text-payment-method">Select Payment Method</h3>
            <div className="space-y-3">
              {enhancedCryptoOptions.map((crypto) => (
                <div
                  key={crypto.symbol}
                  onClick={() => crypto.isAvailable && setSelectedCrypto(crypto)}
                  className={`bg-cmc-dark p-4 rounded-xl border transition-colors ${
                    !crypto.isAvailable 
                      ? "opacity-50 cursor-not-allowed border-gray-700" 
                      : selectedCrypto?.symbol === crypto.symbol
                        ? "border-cmc-blue cursor-pointer"
                        : "border-gray-600 hover:border-cmc-blue cursor-pointer"
                  }`}
                  data-testid={`option-crypto-${crypto.symbol.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={crypto.logo} alt={crypto.symbol} className="w-8 h-8 mr-3" />
                      <div>
                        <div className="font-semibold text-white">{crypto.name}</div>
                        <div className="text-sm text-cmc-gray">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {crypto.isAvailable ? (
                        <>
                          <div className="font-semibold text-white">
                            {calculateCryptoAmount(crypto)} {crypto.symbol}
                          </div>
                          <div className="text-sm text-cmc-gray">≈ ${plan.price}</div>
                          <div className="text-xs text-green-400">
                            Live: ${crypto.rate.toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-red-400">Price unavailable</div>
                      )}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCrypto && (
            <div data-testid="container-payment-details">
              <h3 className="text-lg font-semibold mb-4 text-white">Payment Details</h3>
              <Card className="bg-cmc-dark border-gray-600 p-6">
                <div className="text-center mb-4">
                  <div className="bg-white p-4 rounded-xl inline-block mb-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-xs text-gray-500 text-center">
                        QR Code<br />
                        {selectedCrypto.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-cmc-gray mb-2">Send exactly</div>
                  <div className="text-xl font-bold mb-4 text-white" data-testid="text-payment-amount">
                    {calculateCryptoAmount(selectedCrypto)} {selectedCrypto.symbol}
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-cmc-gray">Wallet Address</Label>
                  <div className="bg-gray-800 p-3 rounded-lg mt-2">
                    <div className="text-sm font-mono break-all text-white" data-testid="text-wallet-address">
                      {selectedCrypto.address}
                    </div>
                    <Button
                      variant="link"
                      className="mt-2 text-cmc-blue text-sm p-0 h-auto"
                      onClick={() => copyToClipboard(selectedCrypto.address)}
                      data-testid="button-copy-address"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Address
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="txHash" className="text-cmc-gray">
                    Transaction ID
                  </Label>
                  <Input
                    id="txHash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                    placeholder="Enter transaction hash"
                    data-testid="input-transaction-hash"
                  />
                  <div className="text-xs text-cmc-gray mt-1">
                    Paste your transaction ID after sending payment
                  </div>
                </div>

                <Button
                  onClick={handleSubmitPayment}
                  disabled={!transactionHash.trim() || createTransactionMutation.isPending}
                  className="w-full bg-cmc-green text-white hover:bg-green-600"
                  data-testid="button-confirm-payment"
                >
                  {createTransactionMutation.isPending ? "Processing..." : "Confirm Payment"}
                </Button>

                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="text-xs text-yellow-400" data-testid="text-payment-warning">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Payment will be verified within 1-3 confirmations. Your mining will start immediately after approval.
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
