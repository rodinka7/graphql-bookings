import React from 'react';
import { Bar } from 'react-chartjs';

import './BookingChart.css';

const BOOKING_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 100,
        max: 200
    },
    Expensive: {
        min: 200,
        max: 1000000
    }
};

const BookingChart = props => {
    const chartData = {
        labels: [],
        datasets: []
    };
    let values = [];

    for (let bucket in BOOKING_BUCKETS) {
        values.push(props.bookings.reduce((prev, item) => {
            if (item.event.price >= BOOKING_BUCKETS[bucket].min
                && item.event.price < BOOKING_BUCKETS[bucket].max) {
                return ++prev;
            }
            return prev;
        }, 0));

        chartData.labels.push(bucket);
        chartData.datasets.push({
            label: bucket,
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: values
        });
        values = [...values];
        values[values.length - 1] = 0;
    };

    return (
        <div className="booking__chart">
            <Bar data={chartData} />
        </div>
    )
}

export default BookingChart;