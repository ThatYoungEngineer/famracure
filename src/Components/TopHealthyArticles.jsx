import React from 'react';
import '../Assets/Css/HomeCss/TopHealthyArticles.css';

const TopHealthyArticles = () => {
    return (
        <section className="top-healthy-articles">
            <div className="container">
                <div className="header-container">
                    <h2>Top Healthy Articles</h2>
                    <a href="/blogs" className="view-all"><u>View All</u></a>
                </div>

                <div className="articles-container">
                    <div className="article">
                        <img src="/img/ar1 (1).png" className="article-img" alt="Basic Dental Care" />
                        <h4>Basic Dental Care</h4>
                    </div>
                    <div className="article">
                        <img src="/img/ar1 (2).png" className="article-img" alt="The Best Worst Foods" />
                        <h4>The Best Worst Foods</h4>
                    </div>
                    <div className="article">
                        <img src="/img/ar1 (3).png" className="article-img" alt="Nutritional Needs Of Baby" />
                        <h4>Nutritional Needs Of Baby</h4>
                    </div>
                    <div className="article">
                        <img src="/img/ar1 (4).png" className="article-img" alt="Can Diabetes Be Reversed?" />
                        <h4>Can Diabetes Be Reversed?</h4>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopHealthyArticles;
