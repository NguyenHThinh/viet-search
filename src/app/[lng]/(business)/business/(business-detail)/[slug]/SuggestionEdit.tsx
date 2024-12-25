"use client";

import { useTranslation } from "@/app/i18n/client";
import { PATH_CLAIM } from "@/contains/paths";
import { IBusiness } from "@/models/iBusiness";
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

const SuggestionEdit = ({ detailData }: { detailData: IBusiness | null }) => {
  const { t } = useTranslation(["common", "claim"]);
  const router = useRouter();

  const TYPE_USER_EDIT = {
    owner: {
      value: "owner",
      url: PATH_CLAIM.suggestClaim(detailData?.id || ""),
    },
    staff: {
      value: "staff",
      url: PATH_CLAIM.suggestClaim(detailData?.id || ""),
    },
    customer: {
      value: "customer",
      url: PATH_CLAIM.suggestEdit(detailData?.id || ""),
    },
  };

  const [isOpenReview, setIsOpenReview] = useState(false);
  const [typeUser, setTypeUser] = useState<string | null>(null);

  // handle close review form
  const handleCloseReviewForm = () => {
    setIsOpenReview(false);
    setTypeUser(null);
  };

  const renderOptionRadio = () => {
    return (
      <>
        <div className="divide-y">
          {Object.values(TYPE_USER_EDIT).map((item) => (
            <div
              className="flex flex-row items-center gap-2 py-4"
              key={item.value}
            >
              <label className="flex w-max cursor-pointer items-center gap-3">
                <div
                  className={`flex aspect-1 w-5 items-center justify-center rounded-full border ${item.value === typeUser ? "border-blue-500" : "border-neutral-600 dark:border-neutral-300"}`}
                >
                  <span
                    className={`aspect-1 w-3 rounded-full bg-blue-400 ${item.value === typeUser ? "block" : "hidden"}`}
                  ></span>
                </div>
                <input
                  className="hidden"
                  type="radio"
                  name="type_user_edit"
                  value={item.value}
                  id={item.value}
                  checked={item.value === typeUser}
                  onChange={(e) => {
                    setTypeUser(e.target.value);
                  }}
                />
                <div className="">
                  <h3 className="text-neutral-700 dark:text-neutral-300">
                    {item === TYPE_USER_EDIT.owner && t("claim:imOwner")}
                    {item === TYPE_USER_EDIT.staff && t("claim:imStaff")}
                    {item === TYPE_USER_EDIT.customer && t("claim:imCustomer")}
                  </h3>
                </div>
              </label>
            </div>
          ))}
        </div>
        <Link
          href={
            typeUser == TYPE_USER_EDIT.owner.value
              ? TYPE_USER_EDIT.owner.url
              : typeUser == TYPE_USER_EDIT.staff.value
                ? TYPE_USER_EDIT.staff.url
                : TYPE_USER_EDIT.customer.url
          }
          onClick={(e) => !typeUser && e.preventDefault()}
          className={`block rounded-lg border py-3 text-center font-semibold ${typeUser ? "bg-primary-500 text-neutral-100 hover:bg-opacity-80" : "cursor-not-allowed bg-neutral-400 text-neutral-500 opacity-50"}`}
        >
          {t("claim:continue")}
        </Link>
      </>
    );
  };

  return (
    <div>
      {/* button open review form */}
      <button
        onClick={() => {
          detailData?.user_id
            ? router.push(TYPE_USER_EDIT.customer.url)
            : setIsOpenReview(true);
        }}
        className="mx-auto flex items-center gap-2 rounded-lg border px-10 py-2 font-medium shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <PencilIcon className="h-5 w-5" />
        <span>{t("claim:suggestEdit")}</span>
      </button>

      <Transition appear show={isOpenReview} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex w-full items-center justify-center"
          onClose={handleCloseReviewForm}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 z-0 h-full w-full bg-gray-900 opacity-40" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                {/* Content */}
                <Dialog.Panel className="fixed max-h-screen w-[400px] overflow-y-auto rounded-md bg-white shadow dark:bg-neutral-700 dark:text-neutral-200 sm:h-auto">
                  <div className="space-y-5 p-10 text-left">
                    <div className="flex items-start justify-between gap-3 rounded-t-md">
                      <p className="text-xl font-bold">
                        {t("claim:relationshipToBusiness")}
                      </p>
                      <button
                        onClick={handleCloseReviewForm}
                        className="focus:outline-none"
                      >
                        <XMarkIcon className="h-7 w-7 text-neutral-600 dark:text-neutral-100" />
                      </button>
                    </div>
                    <p>{t("claim:anyChangeMustVerified")}</p>
                    {renderOptionRadio()}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SuggestionEdit;
