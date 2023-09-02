import { Link } from "react-router-dom";

export function PostCard({ post, avatar }) {
  return (
    <>
      <Link to={`/ViewPost?id=${post.id}`} className="">
        <div className="bg-white dark:bg-gray-900 p-4 space-y-4 border mt-4 rounded transform hover:scale-95 transition-transform">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <div className="text-gray-500 text-sm">{new Date(post.created).toLocaleDateString()}</div>
          </div>
          <pre className="text-left text-lg font-sans whitespace-pre-wrap">{post.body}</pre>
          <div className="mt-2">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-white bg-gray-900 dark:text-gray-900 dark:bg-white px-1 py-0.5 rounded-md text-sm font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex text-left items-center mt-4">
              {avatar ? (
                <img src={avatar} alt="Author avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">?</span>
                </div>
              )}

              <div className="ml-2">
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">{post.owner ? post.owner : post.author.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated: {new Date(post.updated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
