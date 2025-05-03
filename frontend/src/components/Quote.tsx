import { useEffect, useState } from "react";

const quotes = [
    "Writing is the painting of the voice",
    "Blogging is not rocket science. It's about being yourself and putting what you have into it",
    "The best way to become a better writer is to read more and write more",
    "Content is fire, social media is gasoline",
    "Don't focus on having a great blog. Focus on producing a blog that's great for your readers"
];

const Quote = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <div className="bg-slate-200 h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="max-w-lg">
                    <div className="text-4xl font-bold">
                        "{quote}"
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quote;
