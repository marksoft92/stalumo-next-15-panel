import { useTranslations } from "next-intl";

interface LoadMoreButtonProps {
  loadMorePosts: () => void;
  loading: boolean;
}

const LoadMoreButton = ({ loadMorePosts, loading }: LoadMoreButtonProps) => {
  const t = useTranslations("Blog");
  return (
    <div>
      <button
        onClick={loadMorePosts}
        disabled={loading}
        className="text-[#fff] 
      bg-[#EB4036] 
      border-[1px] 
      border-[#EB4036] 
      mt-6
      w-max
      text-[1rem] 
      font-[500] 
      uppercase 
      leading-[1em] 
      tracking-[1.6px] 
      px-[25px] 
      py-[15px] 
      rounded-[0px] 
      transition-all 
      duration-300 
      hover:bg-[#02010100] 
      hover:skew-[-10] transform
   rounded-[5px]
      "
      >
        {loading ? t("loading") : t("loadMore")}
      </button>
    </div>
  );
};

export default LoadMoreButton;
