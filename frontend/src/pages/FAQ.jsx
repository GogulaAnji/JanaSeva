import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    question: 'What is JanaSeva?',
                    answer: 'JanaSeva is a comprehensive platform connecting farmers, workers, doctors, and communities across India. We help farmers sell their produce directly to buyers, workers find jobs, and people access essential services without middlemen.'
                },
                {
                    question: 'Is JanaSeva free to use?',
                    answer: 'Yes! JanaSeva is completely free for all users. Farmers can post their products, workers can list their services, and buyers can browse and connect with sellers - all at no cost.'
                },
                {
                    question: 'How do I create an account?',
                    answer: 'Click on "Register" in the top right corner, fill in your details, select your role (Farmer, Worker, Buyer, etc.), and verify your phone number. You\'ll be ready to start using JanaSeva immediately!'
                }
            ]
        },
        {
            category: 'For Farmers',
            questions: [
                {
                    question: 'How do I post my produce for sale?',
                    answer: 'After logging in, click the green "Post Product" button on the marketplace page. Upload photos of your produce (up to 5), add details like name, price, quantity, and quality. Click "Publish" and your product will be live immediately!'
                },
                {
                    question: 'How do buyers contact me?',
                    answer: 'When someone is interested in your product, you\'ll receive a notification. They can either call you directly using the call button or start a chat conversation to discuss details and negotiate prices.'
                },
                {
                    question: 'Can I edit or delete my posted products?',
                    answer: 'Yes! Go to your dashboard to see all your posted products. You can edit details, update prices, mark items as sold, or delete listings anytime.'
                },
                {
                    question: 'What types of produce can I sell?',
                    answer: 'You can sell all types of agricultural products including vegetables, fruits, grains, pulses, dairy products, flowers, spices, and organic produce. Just select the appropriate category when posting.'
                }
            ]
        },
        {
            category: 'For Workers',
            questions: [
                {
                    question: 'What services can I offer on JanaSeva?',
                    answer: 'You can offer any skilled service including electrical work, plumbing, painting, carpentry, masonry, cleaning, gardening, mechanics, driving, cooking, tutoring, beauty services, tailoring, and more!'
                },
                {
                    question: 'How do I set my pricing?',
                    answer: 'JanaSeva offers flexible pricing options! You can set hourly rates (e.g., ₹200/hour), daily rates (₹500/day), per-job rates (₹1000/job), or mark your pricing as negotiable. You can even set multiple pricing options!'
                },
                {
                    question: 'How do customers find me?',
                    answer: 'Customers can browse the service marketplace, search by category (electrician, plumber, etc.), filter by location, and view your profile with your work photos, pricing, and experience. They can then call or chat with you directly.'
                },
                {
                    question: 'Do I need my own tools?',
                    answer: 'It depends on the job! When posting your service, you can indicate whether you have your own tools. This helps customers know what to expect and can make you more attractive to hire.'
                }
            ]
        },
        {
            category: 'For Buyers',
            questions: [
                {
                    question: 'How do I buy products from farmers?',
                    answer: 'Browse the marketplace, search for products you need, view details and prices, then click "I\'m Interested" or "Chat" to contact the farmer directly. You can discuss quantity, delivery, and negotiate prices through chat or phone.'
                },
                {
                    question: 'How do I hire a worker?',
                    answer: 'Go to the Services marketplace, select the category (electrician, plumber, etc.), browse available workers, check their pricing and experience, then click "Call" to speak directly or "Chat" to discuss your requirements and finalize the booking.'
                },
                {
                    question: 'Is it safe to buy directly from farmers?',
                    answer: 'Yes! JanaSeva connects you directly with local farmers, eliminating middlemen. You can see farmer profiles, ratings, and reviews. Always verify product quality and agree on terms before making a purchase.'
                },
                {
                    question: 'Can I negotiate prices?',
                    answer: 'Absolutely! One of the benefits of JanaSeva is direct communication. Use the chat feature to discuss prices, quantities, and delivery terms with farmers and workers. Many are open to negotiation, especially for bulk orders.'
                }
            ]
        },
        {
            category: 'Chat & Communication',
            questions: [
                {
                    question: 'How does the chat system work?',
                    answer: 'When you express interest in a product or service, a chat conversation is created. You can send messages, share images, discuss requirements, and negotiate prices in real-time. Both parties receive notifications for new messages.'
                },
                {
                    question: 'Can I call directly from the platform?',
                    answer: 'Yes! Every listing has a "Call" button that lets you call the farmer or worker directly using your phone. This is the fastest way to discuss urgent requirements or finalize deals.'
                },
                {
                    question: 'Are my conversations private?',
                    answer: 'Yes, all chats are private between you and the other party. Only you and the person you\'re chatting with can see the conversation. We respect your privacy and don\'t share your conversations.'
                }
            ]
        },
        {
            category: 'Pricing & Payments',
            questions: [
                {
                    question: 'How do payments work?',
                    answer: 'JanaSeva is a connecting platform. Payments are made directly between buyers and sellers. You can agree on payment methods (cash, UPI, bank transfer) during your conversation. We recommend using secure payment methods.'
                },
                {
                    question: 'Are there any fees or commissions?',
                    answer: 'No! JanaSeva doesn\'t charge any fees or commissions. Farmers keep 100% of their earnings, workers keep all their service fees, and buyers pay only the agreed price. No hidden charges!'
                },
                {
                    question: 'Can I get bulk discounts?',
                    answer: 'Yes! Many farmers and workers offer discounts for bulk orders or long-term contracts. Use the chat feature to discuss your requirements and negotiate better prices for larger quantities.'
                }
            ]
        },
        {
            category: 'Technical Support',
            questions: [
                {
                    question: 'What if I forget my password?',
                    answer: 'Click "Forgot Password" on the login page, enter your registered phone number or email, and you\'ll receive instructions to reset your password.'
                },
                {
                    question: 'Can I use JanaSeva on my mobile phone?',
                    answer: 'Yes! JanaSeva is fully mobile-responsive. You can access it from any smartphone browser. Simply visit the website on your mobile device and enjoy all features optimized for mobile use.'
                },
                {
                    question: 'How do I upload photos?',
                    answer: 'When posting a product or service, click the upload area or camera icon. You can select photos from your gallery or take new photos with your camera. You can upload up to 5 photos per listing.'
                },
                {
                    question: 'What if I encounter a problem?',
                    answer: 'Contact our support team through the Contact page or email us. We\'re here to help! Describe your issue and we\'ll respond as quickly as possible to resolve it.'
                }
            ]
        }
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="container">
                <div className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about using JanaSeva</p>
                </div>

                <div className="faq-content">
                    {faqs.map((category, catIndex) => (
                        <div key={catIndex} className="faq-category">
                            <h2 className="category-title">{category.category}</h2>
                            <div className="faq-list">
                                {category.questions.map((faq, qIndex) => {
                                    const globalIndex = `${catIndex}-${qIndex}`;
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={qIndex}
                                            className={`faq-item ${isOpen ? 'open' : ''}`}
                                        >
                                            <button
                                                className="faq-question"
                                                onClick={() => toggleQuestion(globalIndex)}
                                            >
                                                <span>{faq.question}</span>
                                                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                            {isOpen && (
                                                <div className="faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-footer">
                    <h3>Still have questions?</h3>
                    <p>Can't find the answer you're looking for? Contact our support team!</p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
