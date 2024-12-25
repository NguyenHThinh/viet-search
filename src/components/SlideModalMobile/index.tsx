"use client";

import { Popover, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { Fragment } from "react";

interface ISlideModalMobileProps {
  btnContent: React.ReactElement;
  children: React.ReactNode;
}

const SlideModalMobile: React.FunctionComponent<ISlideModalMobileProps> = (
  props,
) => {
  return (
    <div>
      <Popover>
        {({ open, close }) => (
          <>
            {/* button content */}
            <Popover.Button className="outline-none">
              {props.btnContent}
            </Popover.Button>

            {/* Overlay */}
            {open && (
              <Transition
                as={Fragment}
                enter="transition-opacity ease-linear duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="fixed inset-0 z-40 bg-black bg-opacity-50"
                  onClick={close} // Close modal when clicking on overlay
                />
              </Transition>
            )}

            {/* Modal Panel */}
            <Transition
              as={Fragment}
              enter="transition-transform ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transition-transform ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Popover.Panel
                className="fixed inset-x-0 bottom-0 z-50 mb-6 flex w-full flex-col overflow-hidden rounded-t-3xl border bg-white p-4 dark:bg-neutral-900 md:mb-0"
                style={{ maxHeight: "80vh" }}
              >
                {/* Modal Content */}
                <div className="relative h-full overflow-y-auto">
                  <button
                    className="fixed right-4 top-4 z-50 cursor-pointer"
                    onClick={close}
                  >
                    <XMarkIcon className="block h-6 w-6 text-gray-500" />
                  </button>
                  {props.children}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default SlideModalMobile;
