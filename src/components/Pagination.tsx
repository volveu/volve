const Pagination = ({
  currPage,
  totalPages,
  setCurrPage,
}: {
  currPage: number;
  totalPages: number;
  setCurrPage: (page: number) => void;
}) => {
  return (
    <div className="mb-[50px] mt-[50px] flex flex-row items-center gap-10">
      <button
        disabled={currPage === 1}
        onClick={() => setCurrPage(currPage - 1)}
        className="bg-navy-700 hover:bg-navy-800 active:bg-navy-900 rounded-xl p-2 text-base font-medium text-white transition duration-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-caret-left-fill"
          viewBox="0 0 16 16"
        >
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
        </svg>
      </button>
      Page {currPage} of {totalPages}
      <button
        disabled={totalPages === currPage}
        onClick={() => setCurrPage(currPage + 1)}
        className="bg-navy-700 hover:bg-navy-800 active:bg-navy-900 rounded-xl p-2 text-base font-medium text-white transition duration-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-caret-right-fill"
          viewBox="0 0 16 16"
        >
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
