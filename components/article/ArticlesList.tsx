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
      console.log("triggered");

      loadMoreArticles();
    }
  }, [inView]);
  return (
    <>
      <ArticleCard articles={articles} />
      <div className="flex justify-center items-center p-4" ref={ref}>
        <BeatLoader />
      </div>
    </>
  );
};

export default ArticlesList;
