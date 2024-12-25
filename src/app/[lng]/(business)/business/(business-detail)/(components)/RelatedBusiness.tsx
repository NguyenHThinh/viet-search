"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useWindowSize } from "react-use";

import Heading from "@/shared/Heading";
import { variants } from "@/utils/animationVariants";
import PrevBtn from "@/components/PrevBtn";
import NextBtn from "@/components/NextBtn";
import { IBusiness } from "@/models/iBusiness";
import BusinessCard2 from "@/components/BusinessCard2";
import { useTranslation } from "@/app/i18n/client";
import { getRelatedBusiness } from "@/services/business";
import BackgroundSection from "@/components/BackgroundSection";

export interface RelatedBusinessProps {
  className?: string;
  itemClassName?: string;
  businessId: string;
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
}

const RelatedBusiness: FC<RelatedBusinessProps> = ({
  className = "",
  itemClassName = "",
  itemPerRow = 4,
  sliderStyle = "style1",
  businessId,
}) => {
  const { t, i18n } = useTranslation(["detail"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfitem] = useState(0);
  const [relatedData, setRelatedData] = useState<IBusiness[]>([]);

  const windowWidth = useWindowSize().width;

  const getRelated = async () => {
    const response = await getRelatedBusiness(businessId);
    setRelatedData(response?.items ?? []);
    return response;
  };

  useEffect(() => {
    getRelated();
  }, []);

  useEffect(() => {
    if (windowWidth < 320) {
      return setNumberOfitem(1);
    }
    if (windowWidth < 500) {
      return setNumberOfitem(itemPerRow - 3);
    }
    if (windowWidth < 1024) {
      return setNumberOfitem(itemPerRow - 2);
    }
    if (windowWidth < 1280) {
      return setNumberOfitem(itemPerRow - 1);
    }

    setNumberOfitem(itemPerRow);
  }, [itemPerRow, windowWidth]);

  function changeItemId(newVal: number) {
    if (newVal > currentIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < relatedData?.length - 1) {
        changeItemId(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1);
      }
    },
    trackMouse: true,
  });

  if (!numberOfItems) return null;

  if (relatedData?.length === 0) return null;

  return (
    <div className="relative py-16">
      <BackgroundSection />
      <div className={`nc-SectionSliderNewCategories ${className} w-full`}>
        <Heading desc="" isCenter={sliderStyle === "style2"}>
          {t("detail:nearestBusiness")}
        </Heading>
        <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className="relative flow-root" {...handlers}>
            <div className="flow-root overflow-hidden rounded-xl">
              <motion.ul
                initial={false}
                className="relative -mx-2 flex flex-row flex-nowrap xl:-mx-4"
              >
                <AnimatePresence initial={false} custom={direction}>
                  {relatedData?.map((item, indx) => (
                    <motion.li
                      className={`relative flex whitespace-normal px-2 xl:px-4 ${itemClassName}`}
                      custom={direction}
                      initial={{
                        x: `${(currentIndex - 1) * -100}%`,
                      }}
                      animate={{
                        x: `${currentIndex * -100}%`,
                      }}
                      variants={variants(200, 1)}
                      key={indx}
                      style={{
                        minWidth: `calc(100% / ${numberOfItems})`,
                        maxWidth: `calc(100% / ${numberOfItems})`,
                      }}
                    >
                      <BusinessCard2 data={item} lng={i18n.language} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>

            {currentIndex ? (
              <PrevBtn
                style={{ transform: "translate3d(0, 0, 0)" }}
                onClick={() => changeItemId(currentIndex - 1)}
                className="absolute -left-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-left-6 xl:h-12 xl:w-12"
              />
            ) : null}

            {relatedData.length > currentIndex + numberOfItems ? (
              <NextBtn
                style={{ transform: "translate3d(0, 0, 0)" }}
                onClick={() => changeItemId(currentIndex + 1)}
                className="absolute -right-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-right-6 xl:h-12 xl:w-12"
              />
            ) : null}
          </div>
        </MotionConfig>
      </div>
    </div>
  );
};

export default RelatedBusiness;
