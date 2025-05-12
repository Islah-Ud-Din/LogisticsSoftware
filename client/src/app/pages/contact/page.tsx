'use client';
import React, { useState } from 'react';

// Next
import { useRouter } from 'next/navigation';

// Component
import HeaderFunc from '@/app/components/Header/header';
import Sidebar from '@/app/components/sidebar/sidebar';

const Contact = () => {
    // router
    const router = useRouter();

    return (
        <>
            <HeaderFunc />

            <div className="row">
                <div className="col-lg-2">
                    <Sidebar />
                </div>
                <div className="col-lg-10">
                    <h2>Contact</h2>
                    <p>
                        <strong>Contact Us</strong>
                        <br />
                        <strong>Email:</strong>
                    </p>

                </div>
            </div>
        </>
    );
};

export default Contact;
