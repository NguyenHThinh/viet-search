"use client";

import Image from "next/image";
import type { FC } from "react";
import React, { useEffect, useState } from "react";

import Heading from "@/shared/Heading";
import NcPlayIcon from "@/shared/NcPlayIcon";
import NcPlayIcon2 from "@/shared/NcPlayIcon2";
import { useTranslation } from "@/app/i18n/client";
import NextImage from "@/components/NextImage";

export interface VideoType {
  id: string;
  title: string;
  thumbnail: string;
  src: string;
}

export interface SectionVideosProps {
  videos?: VideoType[];
  className?: string;
}

const VIDEOS_DEMO: VideoType[] = [
  {
    id: "1",
    title: "VTV4 VietSearch - Kết nối và phát triển cộng đồng Việt",
    thumbnail:
      "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/vietsearch-vtv4.jpg",
    src: "https://www.youtube.com/embed/PVCoVEhEm9U?si=-B8EQeIXWuMm2_hG?rel=0&amp;autoplay=1",
  },
  {
    id: "2",
    title:
      "VietSearch nhận giải nhì cuộc thi Giải pháp tương lai - Techfest 2021",
    thumbnail:
      "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/vietsearch-techfest-2021.jpeg",
    src: "https://www.youtube.com/embed/UqKCqnM1M00?si=XSVrEiJgOPfcw37N?rel=0&amp;autoplay=1",
  },
  {
    id: "3",
    title:
      "Các phương pháp thu thập, xử lý dữ liệu, xây dựng cơ sở tri thức TS. Lưu Vĩnh Toàn | VietSearch",
    thumbnail:
      "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/luu-vinh-toan-hust.jpeg",
    src: "https://www.youtube.com/embed/sNjN9k6tWG8?si=kFLtNa8BzMUMsto0?rel=0&amp;autoplay=1",
  },
  {
    id: "4",
    title:
      "Từ nhà leo núi đến nhà bắc cầu (Linknovate to the next power) - Tập 1",
    thumbnail:
      "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/vs-linknovate.jpg",
    src: "https://www.youtube.com/embed/o_xUdZm3FMM?si=vK17m-QkjCcJdWJP?rel=0&amp;autoplay=1",
  },
  {
    id: "5",
    title: "VietSearch Introduction",
    thumbnail:
      "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/vietsearch-introduction.webp",
    src: "https://www.youtube.com/embed/mGA47D0pMkk?si=xrDoouydB9nMuRhE?rel=0&amp;autoplay=1",
  },
];

const HomeSectionVideos: FC<SectionVideosProps> = ({
  videos = VIDEOS_DEMO,
  className = "",
}) => {
  const { t } = useTranslation("homepage");
  const [isPlay, setIsPlay] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const renderMainVideo = () => {
    const video: VideoType = videos[currentVideo];
    return (
      <div
        className="group aspect-h-16 aspect-w-16 overflow-hidden rounded-3xl border-4 border-white bg-neutral-800 will-change-transform sm:aspect-h-9 dark:border-neutral-900 sm:rounded-[50px] sm:border-[10px]"
        title={video.title}
      >
        {isPlay ? (
          // <iframe
          //   src={video.src}
          //   title={video.title}
          //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          //   allowFullScreen
          // />
          <iframe
            src={video.src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            <div
              onClick={() => setIsPlay(true)}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            >
              <NcPlayIcon />
            </div>

            <NextImage
              fill
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={video.thumbnail}
              title={video.title}
              alt={video.title}
              sizes="(max-width: 1000px) 100vw,
                (max-width: 1200px) 75vw,
                50vw"
            />
          </>
        )}
      </div>
    );
  };

  const renderSubVideo = (video: VideoType, index: number) => {
    if (index === currentVideo) return null;
    return (
      <div
        className="group aspect-h-16 aspect-w-16 relative cursor-pointer overflow-hidden rounded-2xl sm:aspect-h-12 lg:aspect-h-9 sm:rounded-3xl "
        onClick={() => {
          setCurrentVideo(index);
          !isPlay && setIsPlay(true);
        }}
        title={video.title}
        key={String(index)}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <NcPlayIcon2 />
        </div>
        <NextImage
          fill
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          src={video.thumbnail}
          title={video.title}
          alt={video.title}
          sizes="(max-width: 300px) 100vw,
          (max-width: 1200px) 50vw,
          25vw"
        />
      </div>
    );
  };

  return (
    <div className={`nc-SectionVideos ${className}`}>
      <Heading desc={t("hottestVideos")}>🎬 {t("theVideos")}</Heading>

      <div className="relative flex flex-col sm:py-4 sm:pr-4 md:py-6 md:pr-6 lg:flex-row xl:py-14 xl:pr-14">
        <div className="absolute -inset-y-4 -right-4 z-0 w-2/3 rounded-3xl bg-primary-100 bg-opacity-40 dark:bg-neutral-800 dark:bg-opacity-40 sm:rounded-[50px] md:inset-y-0 md:right-0 xl:w-1/2" />
        <div className="relative grow pb-2 sm:pb-4 lg:pb-0 lg:pr-5 xl:pr-6">
          {renderMainVideo()}
        </div>
        <div className="grid shrink-0 grid-cols-4 gap-2 sm:gap-6 lg:w-36 lg:grid-cols-1 xl:w-40">
          {videos.map(renderSubVideo)}
        </div>
      </div>
    </div>
  );
};

export default HomeSectionVideos;
