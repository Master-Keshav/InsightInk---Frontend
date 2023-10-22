import React, { useEffect, useState } from "react";
import axios from "axios";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const setNews = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}`;
        setLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json();
        props.setProgress(30);
        axios.post('http://localhost:8000/api/add_news', parsedData)
            .then((response) => {
                console.log('Response data:', response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // setArticles(parsedData.articles);
        // setTotalResults(parsedData.totalResults);
    };

    const getNews = () => {
        axios
            .get("http://localhost:8000/api/news")
            .then((response) => {
                // setNews(response.data);
                console.log(response);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        setLoading(false);

    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;


        props.setProgress(10);
        setNews()
        props.setProgress(70);
        getNews()
        props.setProgress(100);
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h1
                className="text-center"
                style={{ margin: "35px 0px", marginTop: "90px" }}
            >
                NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
            </h1>
            {loading && <Spinner />}
            <div className="container">
                <div className="row">
                    {articles.map((element) => {
                        return (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    title={element.title ? element.title : ""}
                                    description={element.description ? element.description : ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

News.defaultProps = {
    country: "in",
    category: "general",
};

News.propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
};

export default News;