import React, { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

const AdminCard: React.FC<CardProps> = ({ children, className = "" }) =>  {
    return (
        <div className={`p-6 bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
            {children}
        </div>
    )
}

export default AdminCard;