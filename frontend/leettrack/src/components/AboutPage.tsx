import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const aboutContent = {
    title: "About AlgoTrackr",
    introduction: `Welcome to <b>AlgoTrackr</b>—a tool designed to help you quantify and improve your LeetCode practice. Our goal is to provide a score from 0 to 100 based on your problem-solving time, accuracy, and personal grasp of the topic. Inspired by a 'retrospective revision' approach, AlgoTrackr aims to highlight where you should focus your studying for technical interviews.`,
    sections: [
      {
        heading: "The Scoring System",
        content: `AlgoTrackr's scoring system evaluates your practice sessions based on three key factors:
        <ul>
          <li><b>Time Taken</b>: The time it takes you to solve a problem.</li>
          <li><b>Accuracy</b>: Your accuracy in solving problems.</li>
          <li><b>Personal Grasp</b>: Your perceived understanding of the topic.</li>
        </ul>
        These factors combine to give you a score from 0 to 100, helping you track your progress and identify areas for improvement.`
      },
      {
        heading: "Inspired by Retrospective Revision",
        content: `Our approach is inspired by the 'retrospective revision' method, as discussed by Ali Abdaal. This method focuses on reviewing and reflecting on past study sessions to optimize future learning. AlgoTrackr applies this principle to technical interview preparation by highlighting your strengths and areas needing improvement based on your practice sessions.`
      },
      {
        heading: "How to Use AlgoTrackr",
        content: `AlgoTrackr is meant to supplement your study efforts and can be adapted to fit your personal learning style. Here’s how you can make the most of it:
        <ul>
          <li><b>Track Your Sessions</b>: Input your practice sessions to get detailed insights and scores.</li>
          <li><b>Analyze Your Performance</b>: Use the statistics page to understand your strengths and weaknesses.</li>
          <li><b>Focus Your Study</b>: Use the filters to concentrate on areas where you need the most improvement.</li>
        </ul>`
      },
      {
        heading: "Supplementing Your Study",
        content: `Remember, AlgoTrackr is a supplementary tool and should be used alongside other study methods. It provides valuable insights into your progress and helps you focus your efforts more effectively, but it’s up to you to integrate these insights into your broader study plan.`
      },
      {
        heading: "Thank You",
        content: `Thank you for choosing AlgoTrackr. Happy practicing and good luck with your interviews!`
      }
    ]
  };

  return (
    <div className="about-page">
      <h1>{aboutContent.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: aboutContent.introduction }} />
      {aboutContent.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.heading}</h2>
          <p dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
