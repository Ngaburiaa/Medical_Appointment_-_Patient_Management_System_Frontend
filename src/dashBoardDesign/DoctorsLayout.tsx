import { Outlet } from 'react-router-dom'
import Card from './Card'
import { DoctorSideNav } from './DoctorSideNav'

export const DoctorsLayout = () => {
    return (
        <div className='flex min-h-screen bg-[#F0F9FF]'>
            
            <div className='hidden lg:block'>
                <DoctorSideNav />
            </div>
            
            
            <div className='flex-1 p-4 lg:p-6 overflow-x-hidden'>
                <div className="max-w-full mx-auto">
                    <Card className="min-h-[calc(100vh-2rem)] border border-[#B8E6F8] shadow-sm">
                        <Outlet />
                    </Card>
                </div>
            </div>
        </div>
    )
}