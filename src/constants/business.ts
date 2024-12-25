export const SUGGESTIONS_KEY = "app.suggestions";
export const WHERE_SUGGESTIONS_KEY = "app.whereSuggestions";

export const STATUS_BUSINESS = {
  verified: "verified",
  null: "null",
  unVerified: "unverified",
};
export const BUSINESS_TYPE = {
  company: "company",
  organization: "organization",
  jointStockCompany: "joint_stock_company", // Công ty cổ phần (JSC)
  limitedLiabilityCompany: "limited_liability_company", // Công ty TNHH (LLC)
  stateOwnedEnterprise: "state_owned_enterprise", // Doanh nghiệp nhà nước
  privateEnterprise: "private_enterprise", // Doanh nghiệp tư nhân
  partnership: "partnership", // Công ty hợp danh,
  householdBusiness: "household_business", // Hộ kinh doanh,
  other: "other",
};

export type BusinessTypeKey = keyof typeof BUSINESS_TYPE;

export const BUSINESS_TYPE_SHOWER = {
  business: "business",
  company: "company",
  privateBusiness: "private_business",
  organization: "organization",
  jointStockCompany: "joint_stock_company", // Công ty cổ phần (JSC)
  limitedLiabilityCompany: "limited_liability_company", // Công ty TNHH (LLC)
  stateOwnedEnterprise: "state_owned_enterprise", // Doanh nghiệp nhà nước
  privateEnterprise: "private_enterprise", // Doanh nghiệp tư nhân
  partnership: "partnership", // Công ty hợp danh,
  householdBusiness: "household_business", // Hộ kinh doanh,
  other: "other",
};

export type BusinessTypeShowerKey = keyof typeof BUSINESS_TYPE_SHOWER;
