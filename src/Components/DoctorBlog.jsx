import React from 'react';
import "../Assets/Css/HomeCss/DoctorBlog.css";
import FooterTopBar from "../Components/FooterTopBar";
import { Footer, Header, Section } from "../Components";

const DoctorBlog = () => {
  const blogs = [
    { 
      id: 1, 
      title: 'Healthy Living Tips', 
      summary: 'Simple steps for better health.', 
      image: '/img/blog1.png' 
    },
    { 
      id: 2, 
      title: 'Nutrition Myths Debunked', 
      summary: 'Facts vs. Fiction.', 
      image: '/img/blog2.png' 
    },
    { 
      id: 3, 
      title: 'Mental Health Matters', 
      summary: 'Tips for mental well-being.', 
      image: '/img/blog1.png' 
    },
    { 
      id: 4, 
      title: 'Exercise and Fitness', 
      summary: 'The importance of regular workouts.', 
      image: '/img/blog2.png' 
    },
    { 
      id: 5, 
      title: 'Sleep and Recovery', 
      summary: 'How to get quality sleep.', 
      image: '/img/blog1.png' 
    },
    { 
      id: 6, 
      title: 'The Power of Preventive Care', 
      summary: 'Early detection saves lives.', 
      image: '/img/blog2.png' 
    },
  ];

  return (
    <>
      <Header /> {/* Render the Header component */}
     <h1
      style={{
        textAlign:'center',
        backgroundColor:'#587FD9',
        fontSize:'26px',
        color:'#ffffff',
        padding:'10px'
      }}
      ><b>Healthy Articles</b></h1>
      <div className="blog-container"
      
      style={{
        marginTop:'50px',
      }}
      >
        
        {blogs.map((blog) => (
          <div key={blog.id} className="card">
            <img src={blog.image} alt={blog.title} className="card-image" />
            <div className="card-content">
              <h2 className="card-title">{blog.title}</h2>
              <p className="card-summary">{blog.summary}</p>
            </div>
          </div>
        ))}
      </div>
      <FooterTopBar/>
      <Footer /> {/* Optionally, render Footer if needed */}
    </>
  );
};

export default DoctorBlog;
