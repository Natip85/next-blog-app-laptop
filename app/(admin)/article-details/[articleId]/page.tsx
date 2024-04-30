import { getArticleById } from "@/actions/getArticleById";
import { getArticleComments } from "@/actions/getArticleComments";
import { getArticleLikes } from "@/actions/getArticleLikes";
import ArticleDetailsClient from "@/components/article/ArticleDetailsClient";
interface ArticleDetailsProps {
  params: {
    articleId: string;
  };
}
const ArticleDetails = async ({ params }: ArticleDetailsProps) => {
  const [article, comments, likes] =
    (await Promise.all([
      getArticleById(params.articleId),
      getArticleComments(params.articleId),
      getArticleLikes(params.articleId),
    ])) || null;

  return (
    <ArticleDetailsClient article={article} comments={comments} likes={likes} />
  );
};

export default ArticleDetails;
