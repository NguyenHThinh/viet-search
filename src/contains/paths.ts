// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "";
const ROOTS_CLAIM = "/claim";
const ROOTS_USER_DASHBOARD = "";
const ROOTS_BUSINESS_DASHBOARD = "/business";

// ----------------------------------------------------------------------

export const PATH_PAGE = {
  root: "/",
  searchBusiness: "/search",
  business: {
    root: "/business",
    detail: (slug: string) => `/business/${slug}`,
  },
  contact: "/contact",
  privacy: "/privacy",
  term: "/term",
  addListing: "/add-listing",
  addBusiness: "/add-business",
  addBusinessWithName: (businessName: string) =>
    `/add-business?bname=${businessName}`,
};

export const PATH_USER_DASHBOARD = {
  account: path(ROOTS_USER_DASHBOARD, "/account"),
  accountWishlist: path(ROOTS_USER_DASHBOARD, "/account-wishlist"),
  accountPassword: path(ROOTS_USER_DASHBOARD, "/account-password"),
  accountBilling: path(ROOTS_USER_DASHBOARD, "/account-billing"),
  accountBusiness: path(ROOTS_USER_DASHBOARD, "/account-business"),
  accountReviews: path(ROOTS_USER_DASHBOARD, "/account-reviews"),
  accountPhotos: path(ROOTS_USER_DASHBOARD, "/account-photos"),
};

export const PATH_BUSINESS_DASHBOARD = {
  createdBusiness: path(ROOTS_BUSINESS_DASHBOARD, "/dashboard"),
  reviewedBusiness: (slug: string) => `/business/business-edit/${slug}/reviews`,
  photosBusiness: (slug: string) => `/business/business-edit/${slug}/photos`,
  logoBusiness: (slug: string) => `/business/business-edit/${slug}/logo`,
  openHoursBusiness: (slug: string) =>
    `/business/business-edit/${slug}/openhours`,
  adsBusiness: (slug: string) =>
    `/business/business-edit/${slug}/vietsearch-ads`,
  editBusiness: (slug: string) => `/business/business-edit/${slug}`,
};

export const PATH_AUTH = {
  login: path(ROOTS_AUTH, "/login"),
  register: path(ROOTS_AUTH, "/register"),
  forgotPassword: path(ROOTS_AUTH, "/forgot-password"),
};

export const PATH_CLAIM = {
  searchClaim: "/claim/business-name",
  claimOptions: (bid: string) => `/claim/${bid}`,
  suggestClaim: (bid: string) => `/claim/suggest-claim?bid=${bid}`,
  suggestEdit: (bid: string) => `/claim/suggest-edit?bid=${bid}`,
  claimVerify: (bid: string) => `/claim/${bid}`,
  verifyCode: (bid: string, email: string) =>
    `/claim/${bid}/verify-code?email=${email}`,
};
