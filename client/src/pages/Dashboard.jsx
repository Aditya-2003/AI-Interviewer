import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar          from '../components/Sidebar'
import Navbar           from '../components/Navbar'
import ResumeCard       from '../components/ResumeCard'
import ApiKeyCard       from '../components/ApiKeyCard'
import RecentInterviews from '../components/RecentInterviews'
import NewInterview     from '../components/NewInterview'

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }
  
  useEffect( () => {
    async function fetchUserInfo() {
      try{
        const url = `${import.meta.env.VITE_URL}/users/me`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        
        //token expired or invalid, log out user and redirect to login page
        if (response.status === 401) {
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("token");
            navigate('/login');
          }
          
          if (response.ok) {
            setUserInfo(result);
          } else {
            console.error("Failed to fetch user info:", result);
            setUserInfo(null);
        }
      }catch(err){
        console.error("Error fetching user info:", err);
      }
    }
    fetchUserInfo();
  },[])

  return (
    <div className="flex min-h-screen bg-[#0a0c12]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar userInfo={userInfo} setLoggedInUser={setUserInfo} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white">Welcome, {userInfo?.username || "User"}</h1>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Ready for your mock interview?<br />
              Set up your preferences below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ResumeCard />
                <ApiKeyCard />
              </div>
              <NewInterview />
            </div>
            <div className="lg:col-span-1">
              {/* <RecentInterviews interviews={interviews} /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard