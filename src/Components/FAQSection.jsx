import React, { useState } from 'react';
import '../Assets/Css/HomeCss/Faq.css';

const FAQSection = () => {
  // Data for FAQ items
  const faqData = [
    {
      question: 'What services do you offer?',
      answer: 'We offer a wide range of medical consultation services including general health check-ups, specialist consultations, and video consultations.'
    },
    {
      question: 'How can I book an appointment?',
      answer: 'You can book an appointment through our website by selecting your preferred doctor and consultation type, and then choosing an available slot.'
    },
    {
      question: 'Is video consultation available?',
      answer: 'Yes, we offer video consultations for patients who prefer online meetings with their doctors.'
    }
    // Add more FAQs as needed
  ];

  // Managing the active FAQ state
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null); // Close the active item if it's clicked again
    } else {
      setActiveIndex(index); // Set clicked item as active
    }
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">
            <h3>{faq.question}</h3>
            <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
          </div>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
