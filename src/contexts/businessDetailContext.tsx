import React, { createContext, useContext, useEffect, useState } from "react";
import { IBusiness } from "@/models/iBusiness";
import { useQuery } from "@tanstack/react-query";
import { getDetailBusiness } from "@/services/business";
import { notFound } from "next/navigation";
import { useAuthContext } from "@/auth/useAuthContext";

const BusinessDetailContext = createContext<{
  detailData: IBusiness | undefined;
  refetch: () => void;
  setDetailData: (data: IBusiness) => void;
  isLoading: boolean;
}>({
  detailData: undefined,
  refetch: () => {},
  setDetailData: (data: IBusiness) => {},
  isLoading: false,
});

export const useBusinessDetail = () => useContext(BusinessDetailContext);

interface BusinessDetailProviderProps {
  slug: string;
  children: React.ReactNode;
}

export const BusinessDetailProvider = ({
  slug,
  children,
}: BusinessDetailProviderProps) => {
  const { user } = useAuthContext();
  const [detailData, setDetailData] = useState<IBusiness | undefined>(
    undefined,
  );

  const getBusinessData = async () => {
    const response = await getDetailBusiness(slug);
    setDetailData(response);
    return response;
  };

  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ["businessData", slug],
    queryFn: () => getBusinessData(),
    enabled: true,
  });

  useEffect(() => {
    if (error) {
      notFound();
    }
    if (data?.id) {
      data?.user_id !== user?.id && notFound();
    }
  }, [data, error]);

  return (
    <BusinessDetailContext.Provider
      value={{ detailData, refetch, setDetailData, isLoading }}
    >
      {children}
    </BusinessDetailContext.Provider>
  );
};
