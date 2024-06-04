import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInComponent from './components/signInComponents/SignInComponent';
import MainPage from './components/mainPage/mainPage';
import Slider from './components/sliderComponent/sliderComponent';
import Proposals from './components/proposalsComponent/proposalsComponent';
import AfterGrading from './components/afterGradingComponent/afterGradingComponent';
import Grading from './components/graidingComponent/grading';
import AddProposal from './components/addProposalComponent/addProposalComponent';
import Registration from './components/registrationPage/registrationComponent';
import ProposerMainPage from './components/proposerMainPageComponent/proposerMainPageComponent';
import Proposers from './components/proposersComponent/proposersComponent'
import OpenProposalGraded from './components/openProposalGradedComponent/openProposalGraded'
import Profile from './components/profile/profile';
import Assigned from './components/assignedMainComponent/assignedMainComponent';
import AssignedSpecialist from './components/assignedSpecialistComponent/assignedSpecialistComponent';
import EditProfile from './components/editProfileComponent/editProfileComponent';
import './reset.css'

function App() {
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const accessToken = localStorage.getItem('accessToken');
  
  return (
    <Router>
      <Routes>
      {!accessToken ? (
          <>
            <Route path="" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<SignInComponent setUserRole={setUserRole} />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/slider" element={<Navigate to="/login" replace />} />
            <Route path="/assigned" element={<Navigate to="/login" replace />} />
            <Route path="/grading" element={<Navigate to="/login" replace />} />
            <Route path="/proposals" element={<Navigate to="/login" replace />} />
            <Route path="/after_grading" element={<Navigate to="/login" replace />} />
            <Route path="/add_proposal" element={<Navigate to="/login" replace />} />
            <Route path="/proposers" element={<Navigate to="/login" replace />} />
            <Route path="/main" element={<Navigate to="/login" replace />} />
            <Route path="/open_proposal_graded" element={<Navigate to="/login" replace />} />
            <Route path="/profile/:profileId" element={<Navigate to="/login" replace />} />
            <Route path="/edit_profile" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to='/main' replace />} />
            <Route path="/registration" element={<Navigate to='/main' replace />} />
            <Route path="password_reset" element={<Navigate to='/main' replace />}></Route>
            <Route path="/slider" element={<Slider />} />
            <Route path="/grading" element={<Grading />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/after_grading" element={<AfterGrading />} />
            <Route path="/add_proposal" element={<AddProposal />} />
            <Route path="/proposers" element={<Proposers />} />
            <Route path="/main" element={userRole === 'proposer' ? <ProposerMainPage /> : <MainPage />} />
            <Route path="/assigned" element={userRole === 'proposer' ? <AssignedSpecialist /> : <Assigned />} />
            <Route path="/open_proposal_graded" element={<OpenProposalGraded />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/edit_profile" element={<EditProfile />} />
          </>
        )}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;