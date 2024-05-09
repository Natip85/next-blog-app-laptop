"use client";

import { getAllArticles } from "@/actions/getAllArticles";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ArticleCard from "./ArticleCard";
import { BeatLoader } from "react-spinners";

const ArticlesList = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  // function shuffleArray(array: any) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }

  // const shuffledProducts = shuffleArray(articles);
  const loadMoreArticles = async () => {
    const nextPage = page + 1;
    const newArticles = await getAllArticles(nextPage);
    if (newArticles) {
      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setPage(nextPage);
    }
  };
  useEffect(() => {
    if (inView) {
      loadMoreArticles();
    }
  }, [inView]);
  return (
    <div>
      <ArticleCard articles={articles} />
      <div className="flex justify-center items-center p-4 mt-16" ref={ref}>
        <BeatLoader />
      </div>
    </div>
  );
};

export default ArticlesList;
