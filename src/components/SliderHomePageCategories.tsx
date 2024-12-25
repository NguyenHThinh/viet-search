"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useWindowSize } from "react-use";

import Heading from "@/shared/Heading";
import { variants } from "@/utils/animationVariants";

import NextBtn from "./NextBtn";
import PrevBtn from "./PrevBtn";
import { iCountriesHomePage } from "@/models/iHomepageCats";
import { iCategory } from "@/models/iFacets";
import { IBusiness } from "@/models/iBusiness";
import HomeCardContries from "./HomeCardContries";
import HomeCardAssociations from "./HomeCardAsspciations";
import HomeCardCategories from "./HomeCardCategories";
import HomeCardBusiness from "./HomeCardBusiness";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { useTranslation } from "@/app/i18n/client";

export interface SliderHomePageCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories: iCountriesHomePage[] | iCategory[] | IBusiness[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
}

const SliderHomePageCategories: FC<SliderHomePageCategoriesProps> = ({
  heading = "",
  subHeading = "",
  className,
  itemClassName,
  categories,
  itemPerRow = 5,
  categoryCardType = "card3",
  sliderStyle = "style1",
}) => {
  const { t, i18n } = useTranslation("common");
  const { setFilter } = useBusinessSearchContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfitem] = useState(0);

  const windowWidth = useWindowSize().width;
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
      if (currentIndex < categories?.length - 1) {
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

  const renderCard = (item: IBusiness | iCountriesHomePage | iCategory) => {
    switch (categoryCardType) {
      case "card3":
        return (
          <HomeCardBusiness cardData={item as IBusiness} lng={i18n.language} />
        );
      case "card4":
        return (
          <HomeCardAssociations
            cardData={item as IBusiness}
            lng={i18n.language}
          />
        );
      case "card5":
        return (
          <HomeCardCategories
            cardData={item as iCategory}
            lng={i18n.language}
            t={t}
          />
        );
      default:
        return (
          <HomeCardContries
            cardData={item as iCountriesHomePage}
            lng={i18n.language}
            t={t}
          />
        );
    }
  };

  if (!numberOfItems) return null;

  return (
    <div className={`nc-SliderHomePageCategories ${className}`}>
      <Heading desc={subHeading || ""} isCenter={sliderStyle === "style2"}>
        {heading}
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
              className="relative -mx-2 whitespace-nowrap xl:-mx-4"
            >
              <AnimatePresence initial={false} custom={direction}>
                {categories?.map((item, indx) => (
                  <motion.li
                    className={`relative inline-block h-full px-2 xl:px-4 ${itemClassName}`}
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
                      width: `calc(1/${numberOfItems} * 100%)`,
                    }}
                  >
                    {renderCard(item)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>

          {categoryCardType === "card4" && (
            <div className="mt-8 flex items-center justify-center">
              <ButtonSecondary
                onClick={() => {
                  setFilter({ categories: "associations" });
                }}
              >
                {t("showMore")}
              </ButtonSecondary>
            </div>
          )}

          {currentIndex ? (
            <PrevBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex - 1)}
              className="absolute -left-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-left-6 xl:h-12 xl:w-12"
            />
          ) : null}

          {categories?.length > currentIndex + numberOfItems ? (
            <NextBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className="absolute -right-3 top-1/3 z-[1] h-9 w-9 -translate-y-1/2 text-lg xl:-right-6 xl:h-12 xl:w-12"
            />
          ) : null}
        </div>
      </MotionConfig>
    </div>
  );
};

export default SliderHomePageCategories;
