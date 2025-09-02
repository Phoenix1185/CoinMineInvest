import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface MiningEarning {
  id: number;
  contractId: number;
  userId: number;
  date: string;
  amount: string;
  usdValue: string;
  createdAt: string;
}

interface AllEarningsResponse {
  earnings: MiningEarning[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

interface AllEarningsViewProps {
  onBack: () => void;
}

export default function AllEarningsView({ onBack }: AllEarningsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 50;

  const { data, isLoading } = useQuery<AllEarningsResponse>({
    queryKey: ['/api/earnings/all', currentPage, limit],
    queryFn: async () => {
      const response = await fetch(`/api/earnings/all?page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch earnings');
      }
      return response.json();
    },
  });

  const earnings = data?.earnings || [];
  const pagination = data?.pagination;

  const formatBtc = (amount: string) => {
    return `${Number(amount).toFixed(8)} BTC`;
  };

  const formatUsd = (amount: string) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost" 
            onClick={onBack}
            className="text-white hover:bg-gray-700"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="text-center py-8">
          <div className="text-cmc-gray">Loading all earnings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="container-all-earnings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost" 
            onClick={onBack}
            className="text-white hover:bg-gray-700"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h2 className="text-2xl font-bold text-white" data-testid="text-all-earnings-title">
              All Mining Earnings
            </h2>
            <p className="text-cmc-gray">
              {pagination && `${pagination.totalRecords.toLocaleString()} total earnings`}
            </p>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <Card className="bg-cmc-card border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">
              Earnings History
            </CardTitle>
            {pagination && (
              <Badge variant="secondary" className="bg-cmc-blue text-white">
                Page {pagination.currentPage} of {pagination.totalPages}
              </Badge>
            )}
          </div>
          <CardDescription className="text-cmc-gray">
            Detailed view of all your mining earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cmc-gray">No earnings found</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors"
                      data-testid={`earning-item-${earning.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium text-white">
                            {formatBtc(earning.amount)}
                          </div>
                          <div className="text-sm text-cmc-gray">
                            ({formatUsd(earning.usdValue)})
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-gray-600 text-gray-400"
                          >
                            Contract #{earning.contractId}
                          </Badge>
                        </div>
                        <div className="text-xs text-cmc-gray mt-1">
                          {new Date(earning.date).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-xs text-cmc-gray">
                        #{earning.id}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                  <div className="text-sm text-cmc-gray">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} earnings
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={pagination.currentPage <= 1}
                      className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm text-white px-3">
                      {pagination.currentPage}
                    </span>
                    
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={pagination.currentPage >= pagination.totalPages}
                      className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}