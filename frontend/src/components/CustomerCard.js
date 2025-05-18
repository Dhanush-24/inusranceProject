import React, { useState } from 'react';
import { Carousel, Card,  Container, Row, Col } from 'react-bootstrap';
import { Star } from 'lucide-react';

const CustomerSpeak = () => {
    const reviewsData = [
        {
            id: 1,
            title: 'Flood Damage Repair',
            text: 'My car was damaged due to the floods last month in my state. Fortunately, I had Acko car insurance and it helped me financially to get my car repaired. ',
            rating: 5,
            productName: 'Acko car Insurance',
            customerName: 'By Nilutpal Das',
            reviewDate: 'On: 12th July, 2024',
        },
        {
            id: 2,
            title: 'Excellent Guidance',
            text: 'When my bike was stolen, I was worried about the expenses. My friend recommended InsuranceDekho, and they provided excellent guidance on how to claim my ICICI bike Insurance ',
            rating: 5,
            productName: 'ICICI Lombard bike Insurance',
            customerName: 'By Simran Kaur',
            reviewDate: 'On: 2nd July, 2024',
        },
        {
            id: 3,
            title: 'Accident Claim Settlement',
            text: 'I was involved in a minor accident where the front bumper of my car was damaged. HDFC ERGO’s claim process was smooth and efficient. My claim was approved within a day ',
            rating: 4,
            productName: 'HDFC ERGO car Insurance',
            customerName: 'By Arundhati Raj Gupta',
            reviewDate: 'On: 2nd July, 2024',
        },
        {
            id: 4,
            title: 'Smooth Third-Party Accident Claim',
            text: 'Last week my car hit a pedestrian by accident, and it injured him severely. After taking him to the hospital emergency, I was quick with my action to inform ICICI they helped financially by claiming My Insurance ',
            rating: 5,
            productName: 'ICICI Lombard car insurance',
            customerName: 'By Padmashree Saini',
            reviewDate: 'On: 2nd July, 2024',
        },
        // Add more review objects as needed
    ];

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex:(number)) => {
        setIndex(selectedIndex);
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-3">Customer&apos;s Speak</h2>
            <p className="text-center text-muted mb-4">Know why did they choose InsuranceDekho!</p>
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                className="w-100 mx-auto"
            >
                {reviewsData.map((review, i) => (
                    <Carousel.Item key={review.id}>
                        <Row className="justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                                <Card className="shadow-sm h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="text-muted h1">““</div>
                                        <Card.Title className="h4">{review.title}</Card.Title>
                                        <Card.Text className="flex-grow-1">
                                            {review.text}
                                            <span className="text-primary cursor-pointer">{review.readMore}</span>
                                        </Card.Text>
                                        <div className="mb-2">
                                            {Array.from({ length: review.rating }).map((_, index) => (
                                                <Star key={index} className="text-warning" size={20} />
                                            ))}
                                        </div>
                                        <h4 className="h6">{review.productName}</h4>
                                        <p className="text-muted small">{review.customerName}</p>
                                        <p className="text-muted small">{review.reviewDate}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            {i + 1 < reviewsData.length && (
                                <Col xs={12} md={8} lg={6}>
                                     <Card className="shadow-sm h-100">
                                        <Card.Body className="d-flex flex-column">
                                            <div className="text-muted h1">““</div>
                                            <Card.Title className="h4">{reviewsData[i+1].title}</Card.Title>
                                            <Card.Text className="flex-grow-1">
                                                {reviewsData[i+1].text}
                                                <span className="text-primary cursor-pointer">{reviewsData[i+1].readMore}</span>
                                            </Card.Text>
                                            <div className="mb-2">
                                                {Array.from({ length: reviewsData[i+1].rating }).map((_, index) => (
                                                    <Star key={index} className="text-warning" size={20}/>
                                                ))}
                                            </div>
                                            <h4 className="h6">{reviewsData[i+1].productName}</h4>
                                            <p className="text-muted small">{reviewsData[i+1].customerName}</p>
                                            <p className="text-muted small">{reviewsData[i+1].reviewDate}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};

export default CustomerSpeak;
