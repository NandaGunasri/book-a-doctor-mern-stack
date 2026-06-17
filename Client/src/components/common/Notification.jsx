import { Tabs, message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup, Container } from 'react-bootstrap';

const API = import.meta.env.VITE_API_URL;

const Notification = ({ userdata, setUserdata }) => {
  const navigate = useNavigate();

  const handleAllMarkRead = async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/getallnotification`,
        { userId: userdata._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        const updatedUser = {
          ...userdata,
          notification: [],
          seennotification: [
            ...(userdata.seennotification || []),
            ...(userdata.notification || []),
          ],
        };

        localStorage.setItem('userData', JSON.stringify(updatedUser));
        message.success(res.data.message);
        setUserdata(updatedUser);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handledeleteAllMark = async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/deleteallnotification`,
        { userId: userdata._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        const updatedUser = {
          ...userdata,
          seennotification: [],
        };

        localStorage.setItem('userData', JSON.stringify(updatedUser));
        message.success(res.data.message);
        setUserdata(updatedUser);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleNotificationClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const tabItems = [
    {
      key: 'unread',
      label: `Unread (${userdata.notification?.length || 0})`,
      children: (
        <Card className="notification-card border-0 shadow-sm mt-3">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3 border-0">
            <span className="fw-semibold text-dark">Unread Messages</span>
            {userdata.notification?.length > 0 && (
              <Button variant="link" className="p-0 text-decoration-none text-primary fw-medium" onClick={handleAllMarkRead}>
                Mark all as read
              </Button>
            )}
          </Card.Header>
          <ListGroup variant="flush">
            {userdata.notification?.length > 0 ? (
              userdata.notification.map((item, idx) => (
                <ListGroup.Item
                  key={`unread-${idx}`}
                  action
                  onClick={() => handleNotificationClick(item.onClickPath)}
                  className="d-flex align-items-center justify-content-between py-3 border-light notification-item"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="unread-dot"></div>
                    <span className="text-dark-emphasis">{item.message}</span>
                  </div>
                  <span className="text-muted small">Click to view</span>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center py-5 text-muted">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="mb-0">No new notifications</p>
              </div>
            )}
          </ListGroup>
        </Card>
      ),
    },
    {
      key: 'read',
      label: `Read (${userdata.seennotification?.length || 0})`,
      children: (
        <Card className="notification-card border-0 shadow-sm mt-3">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3 border-0">
            <span className="fw-semibold text-dark">Read Messages</span>
            {userdata.seennotification?.length > 0 && (
              <Button variant="link" className="p-0 text-decoration-none text-danger fw-medium" onClick={handledeleteAllMark}>
                Delete all read
              </Button>
            )}
          </Card.Header>
          <ListGroup variant="flush">
            {userdata.seennotification?.length > 0 ? (
              userdata.seennotification.map((item, idx) => (
                <ListGroup.Item
                  key={`read-${idx}`}
                  action
                  onClick={() => handleNotificationClick(item.onClickPath)}
                  className="d-flex align-items-center justify-content-between py-3 border-light notification-item seen-item"
                >
                  <span className="text-muted px-3">{item.message}</span>
                  <span className="text-muted small">Viewed</span>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center py-5 text-muted">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <p className="mb-0">No read notifications</p>
              </div>
            )}
          </ListGroup>
        </Card>
      ),
    },
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-start font-heading fw-bold">Notifications</h2>
      <Tabs defaultActiveKey="unread" items={tabItems} className="custom-tabs" />
    </Container>
  );
};

export default Notification;