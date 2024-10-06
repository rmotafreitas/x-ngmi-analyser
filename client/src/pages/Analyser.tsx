import { Suspense, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  LoaderFunctionArgs,
  Await,
  defer,
  useParams,
} from "react-router-dom";
import { fetchUserAnalysis } from "../api/xApi";
import { Post, UserAnalysis } from "../../../shared/types";
import html2canvas from "html2canvas";

export function analyserLoader({ params }: LoaderFunctionArgs) {
  if (!params.username) {
    throw new Error("Username is required");
  }
  return defer({ analysis: fetchUserAnalysis(params.username) });
}

function parseNumber(str: string): number {
  const suffixes: { [key: string]: number } = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };

  const num: number = parseFloat(str);
  if (!isNaN(num) && str === num.toString()) {
    return num;
  }

  const match: RegExpMatchArray | null = str.match(/^(\d+(\.\d+)?)([KMBT])$/i);
  if (!match) {
    return NaN;
  }

  const [, numPart, , suffix]: string[] = match;
  const parsedNum: number = parseFloat(numPart);
  const multiplier: number = suffixes[suffix.toUpperCase()] || 1;

  return parsedNum * multiplier;
}

const AnalyzedPostSquare = ({
  post,
  user,
}: {
  post: Post;
  user: UserAnalysis;
}) => {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="w-64 h-48 flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between">
      <div className="flex items-center space-x-2">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <p className="text-xs text-gray-500 truncate">{user.name}</p>
      </div>
      <p className="text-sm font-medium text-gray-900 line-clamp-2 flex-grow my-2">
        {truncateText(post.text, 100)}
      </p>
      <div className="flex justify-between text-xs text-gray-500">
        <span title="Likes" className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {post.likes}
        </span>
        <span title="Reposts" className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
          </svg>
          {post.reposts}
        </span>
        <span title="Comments" className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
              clipRule="evenodd"
            />
          </svg>
          {post.comments}
        </span>
        <span title="Views" className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          {post.views}
        </span>
      </div>
    </div>
  );
};

function AnalysisContent({ analysis }: { analysis: UserAnalysis }) {
  const ngmiStatus = analysis.is_a_ngmi
    ? "Not Gonna Make It"
    : "Going to Make It";
  const statusColor = analysis.is_a_ngmi ? "text-red-600" : "text-green-600";
  const progressColor =
    analysis.success_percentage < 50 || analysis.is_a_ngmi
      ? "bg-red-500"
      : "bg-green-500";
  const followerRatio = (
    parseNumber(analysis.followersCount) / parseNumber(analysis.followingCount)
  ).toFixed(2);
  const followerRatioColor =
    parseNumber(analysis.followingCount) >= parseNumber(analysis.followersCount)
      ? "text-red-600"
      : "text-green-600";

  const analysisRef = useRef<HTMLDivElement>(null);
  const watermarkTextRef = useRef<HTMLDivElement>(null);

  const handleShareOnX = async () => {
    await handleDownloadCanvas();
    const text = `Check out my X-NGMI analysis! I'm ${ngmiStatus} with a success percentage of ${analysis.success_percentage}%`;
    const url = window.location.href;
    const hashtags = "XNGMI,Analysis";
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    window.open(twitterIntentUrl, "_blank");
  };

  const handleDownloadCanvas = async () => {
    if (analysisRef.current && watermarkTextRef.current) {
      const originalWidth = analysisRef.current.style.width;
      const originalHeight = analysisRef.current.style.height;
      const originalPosition = analysisRef.current.style.position;
      const originalLeft = analysisRef.current.style.left;

      try {
        // Set a fixed desktop width (adjust as needed)
        analysisRef.current.style.width = "1200px";
        analysisRef.current.style.height = "auto";
        analysisRef.current.style.position = "absolute";
        analysisRef.current.style.left = "-9999px";
        watermarkTextRef.current.classList.remove("hidden");

        const canvas = await html2canvas(analysisRef.current, {
          scale: 2, // Increase scale for better quality
          logging: false,
          useCORS: true, // This might be necessary for loading images from other domains
          windowWidth: 1200,
          windowHeight: 800,
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${analysis.username}-xngmi-analysis.png`;
        link.click();
      } catch (error) {
        console.error("Error generating canvas:", error);
        alert("Failed to generate image. Please try again.");
      } finally {
        // Restore original styles
        analysisRef.current.style.width = originalWidth;
        analysisRef.current.style.height = originalHeight;
        analysisRef.current.style.position = originalPosition;
        analysisRef.current.style.left = originalLeft;
        watermarkTextRef.current.classList.add("hidden");
      }
    }
  };

  const rootUrl = window.location.origin;
  const watermarkText = `Made on: ${rootUrl}`;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="m-auto max-w-6xl">
        <div className="flex justify-between items-center p-4 max-sm:flex-col">
          <p className="font-bold text-2xl">Analysis Result</p>
          <div className="flex space-x-2">
            <button
              onClick={handleShareOnX}
              className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button
              onClick={handleDownloadCanvas}
              className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Image
            </button>
          </div>
        </div>
        <div className="mx-auto p-4 bg-white" ref={analysisRef}>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3">
              <img
                src={analysis.profilePicture}
                alt="Profile"
                className="w-48 h-48 rounded-full mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-center">
                {analysis.name.replace(analysis.username, "").trim()}
              </h1>
              <p className="text-gray-600 text-center">{analysis.username}</p>
              <p className="text-center mt-4">
                Follower Ratio:{" "}
                <span className={followerRatioColor}>{followerRatio}%</span>
              </p>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className={`text-3xl font-bold ${statusColor} mb-4`}>
                NGMI Status: {ngmiStatus}
              </h2>
              <p className="text-lg">{analysis.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${progressColor} h-4 rounded-full`}
                style={{ width: `${analysis.success_percentage}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">
              Success Percentage: {analysis.success_percentage}%
            </p>
          </div>
          <div
            ref={watermarkTextRef}
            className="font-extralight text-sm italic text-gray-400 text-end hidden"
          >
            {watermarkText}
          </div>
        </div>
        <p className="font-bold text-2xl p-4">Analyzed posts</p>
        <div className="flex overflow-x-scroll gap-4 p-4 max-xl:w-screen">
          {analysis.posts.map((post, index) => (
            <AnalyzedPostSquare key={index} post={post} user={analysis} />
          ))}
        </div>
      </div>
    </div>
  );
}

const messages = [
  "Searching for user @xyz",
  "Analyzing posts @xyz",
  "Generating result @xyz",
  "Finalizing analysis @xyz",
];

function LoadingSpinnerAnalysis() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) =>
        prevIndex + 1 < messages.length ? prevIndex + 1 : messages.length - 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const params = useParams();

  if (!params.username) {
    throw new Error("Username is required");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-lg font-semibold mb-2">
        {messages[messageIndex].replace("@xyz", `@${params.username}`)}
      </div>
      <div className="text-sm text-gray-500">
        Please wait while we analyze the profile...
      </div>
    </div>
  );
}

export function AnalyserPage() {
  const { analysis } = useLoaderData() as { analysis: Promise<UserAnalysis> };

  return (
    <Suspense fallback={<LoadingSpinnerAnalysis />}>
      <Await resolve={analysis}>
        {(resolvedAnalysis) => <AnalysisContent analysis={resolvedAnalysis} />}
      </Await>
    </Suspense>
  );
}
