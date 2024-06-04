import React, { useState, useEffect, useRef} from 'react';
import styled from "styled-components";
import Spinner from '../spinner/spinner';
import searchIconSvg from '../../images/search-icon.svg';
import { fetchUserData, getGrades, getProposerById, getComments, fetchGradedProposalData, fetchProposalData, fetchGradingsData, 
  addComment, updateProposalStatusArchive, fetchProposersData, setSpecialist } from '../../services/apiService';
import Logo from '../../images/User-512.webp';
import { Link } from 'react-router-dom';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './style.css'; 

export const logOut = () => {
  localStorage.removeItem('accessToken');
  window.location.href = "../login";
};


function OpenProposal(props) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalData, setProposalData] = useState(null);
  const [allProposals, setAllProposals] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [proposerData, setProposersData] = useState(null);
  const [allProposers, setAllProposers] = useState(null);
  const [selectedProposers, setSelectedProposers] = useState(null);
  const [gradingsData, setGradingsData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [proposersProposals, setProposersProposals] = useState(null);
  const [proposersProposalsFull, setProposersProposalsFull] = useState(null);
  const [grades, setGrades] = useState(new Map());
  const [query, setQuery] = useState('');
  const [proposerInfo, setProposerInfo] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const headerLabelWidths = [89, 89.5, 97, 88.5, 89.5, 89, 89.5, 89, 89, 95.5, 88.5];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(-1);
  const [isEmployeeSelected, setIsEmployeeSelected] = useState(false);
  const [isCalendarSelected, setIsCalendarSelected] = useState(false);
  
    const handleAssignClick = async () => {
      try{
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      console.log("Id: ", proposalData[currentIndex].id);
      console.log("Proposer: ", allProposers[selectedEmployee].id);
      console.log("Date: ", selectedDate);
      if(isEmployeeSelected && isCalendarSelected){
        await setSpecialist(proposalData[currentIndex].id, allProposers[selectedEmployee].user.id, selectedDate);
        
        setShowCalendar(false);
        updateProposalList();
        setSelectedEmployee(-1);
        setSelectedDate(new Date());
        setIsEmployeeSelected(false);
        setIsCalendarSelected(false);
      }
      else {
        if(isCalendarSelected){
          alert('Select an employee');
        } else if(isEmployeeSelected){
          alert('Select a deadline');
        } else {
          alert('Select an employee and deadline');
        }
      }
      const formattedDate = `${year}-${month}-${day}`;
      alert("Proposal assigned to specialist");
      console.log("Selected Employee:", allProposers[selectedEmployee].id);
      console.log("Selected Date:", formattedDate);
      } catch (error) {
      console.error(error);
    }
    };

    const handleDateChange = (date) => {
      if (date >= new Date()) {
        setIsCalendarSelected(true);
        setSelectedDate(date);
      }
    };
  
    const handleEmployeeSelect = (index) => {
      setIsEmployeeSelected(true);
      setSelectedEmployee(index);
    };
  
    const tileDisabled = ({ date, view }) => {
      if (view === "month") {
        return date < new Date();
      }
    };

    const employeeSearchHandler = (event) => {
      const { value } = event.target;
      setQuery(value);
      if (value === '') {
        setSelectedProposers(allProposers);
      } else{
      
      const filteredProposals = allProposers.filter(proposer => {
        const fullName = `${proposer.user.first_name} ${proposer.user.last_name}`;
        return fullName.toLowerCase().includes(value.toLowerCase());
      });
        setSelectedProposers(filteredProposals);
      }
    };

    useEffect(() => {
      function handleClickOutside(event) {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
          setShowCalendar(false);
          setIsEmployeeSelected(false);
          setIsCalendarSelected(false);
          setSelectedEmployee(-1);
          setSelectedDate(new Date());
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
  const fetchData = async () => {
    try {
      const allProposalsResponse = await fetchProposalData();
      const userDataResponse = await fetchUserData();
      const proposalDataResponse = await fetchGradedProposalData();
      const gradingsDataResponse = await fetchGradingsData();
      const proposersDataResponse = await fetchProposersData();
      const transformedData = [];
      proposersDataResponse.forEach((item, index) => {
        transformedData[index] = item;
      });
      setSelectedEmployee(transformedData.length-1);
      setAllProposers(transformedData);
      setSelectedProposers(transformedData);

      if (userDataResponse) {
        setUserData(userDataResponse);
      } 
      setAllProposals(allProposalsResponse);
      setProposalData(proposalDataResponse);
      setGradingsData(gradingsDataResponse);
      
      if (proposalDataResponse.length > 0) {
        const proposer = await getProposerById(proposalDataResponse[0].proposer);
        const comments = await getComments(proposalDataResponse[0].id); 
        const filteredArray = proposalDataResponse.filter(item => item.proposer === proposalDataResponse[0].proposer);
        console.log("1");
        
        setProposersProposals(filteredArray);
        setProposersProposalsFull(filteredArray);
        setProposersData(proposer);
        setComments(comments);

        filteredArray.forEach(async (item) =>  {
          if(!grades.has(item.id)){
            const gradesDataResponse = await getGrades(item.id);
            setGrades(grades.set(item.id, gradesDataResponse[0].gradings));  
          }
        });
        const filteredProposersProposals = allProposalsResponse.filter(item => item.proposer === proposalDataResponse[0].proposer);
        const acceptedProposals = filteredProposersProposals.filter(item => item.status === 'Accepted');
        const declinedProposals = filteredProposersProposals.filter(item => item.status === 'Declined');
        setProposerInfo([{
          title: "Total sent",
          value: filteredProposersProposals.length,
          description: "During all this time",
        },
        {
          title: "Accepted",
          value: acceptedProposals.length,
          description: "During all this time",
        },
        {
          title: "Rejected",
          value: declinedProposals.length,
          description: "During all this time",
        },]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  const handleAddComment = async () => {
    try {
      await addComment(proposalData[currentIndex].id, commentText);
      const comments = await getComments(proposalData[currentIndex].id);
      setComments(comments);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddComment();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateProposalList = async () => {
    try {
      const updatedProposalData = await fetchGradedProposalData();
      setProposalData(updatedProposalData);
    } catch (error) {
      console.error('Error updating proposal list:', error);
    }
  };

  const archive = async (id) => {
    await updateProposalStatusArchive(proposalData[currentIndex].id, "Archived");
    updateProposalList();
  }

  const fetchProposerData = async (id) => {
    try {
      if (id) {
        const proposer = await getProposerById(id);

        setProposersData(proposer);
      }
    } catch (error) {
      console.error('Error fetching proposer data:', error);
    }
  };

  const fetchCommentsData = async (id) => {
    try {
      if (id) {
        const comments = await getComments(id); 

        setComments(comments);
      }
    } catch (error) {
      console.error('Error fetching comments data:', error);
    }
  };

  const handleNext = () => {
    const nextProposal = proposalData.find((data, index) => index > currentIndex && data.status === "Graded");
    if (nextProposal) {
      if(nextProposal.proposer != proposerData.proposer){
          const filteredProposersProposals = allProposals.filter(item => item.proposer === nextProposal.proposer);
          const acceptedProposals = filteredProposersProposals.filter(item => item.status === 'Accepted');
          const declinedProposals = filteredProposersProposals.filter(item => item.status === 'Declined');
          setProposerInfo([{
            title: "Total sent",
            value: filteredProposersProposals.length,
            description: "During all this time",
          },
          {
            title: "Accepted",
            value: acceptedProposals.length,
            description: "During all this time",
          },
          {
            title: "Rejected",
            value: declinedProposals.length,
            description: "During all this time",
          },]);
          const filteredArray = proposalData.filter(item => item.proposer === nextProposal.proposer);
          setProposersProposals(filteredArray);
          setProposersProposalsFull(filteredArray);
          filteredArray.forEach(async (item) =>  {
            if(!grades.has(item.id)){
              const gradesDataResponse = await getGrades(item.id);
              setGrades(grades.set(item.id, gradesDataResponse[0].gradings));  
            }
          });
        }
      }
      setCurrentIndex(proposalData.indexOf(nextProposal));
      fetchProposerData(nextProposal.proposer);
      fetchCommentsData(nextProposal.id);
  };

  const handleBack = () => {
    const prevProposal = proposalData.slice(0, currentIndex).reverse().find(data => data.status === "Graded");
    if (prevProposal) {
      if(prevProposal.proposer != proposerData.proposer){
          const filteredProposersProposals = allProposals.filter(item => item.proposer === prevProposal.proposer);
          const acceptedProposals = filteredProposersProposals.filter(item => item.status === 'Accepted');
          const declinedProposals = filteredProposersProposals.filter(item => item.status === 'Declined');
          setProposerInfo([{
            title: "Total sent",
            value: filteredProposersProposals.length,
            description: "During all this time",
          },
          {
            title: "Accepted",
            value: acceptedProposals.length,
            description: "During all this time",
          },
          {
            title: "Rejected",
            value: declinedProposals.length,
            description: "During all this time",
          },]);
        const filteredArray = proposalData.filter(item => item.proposer === prevProposal.proposer);
        setProposersProposals(filteredArray);
        setProposersProposalsFull(filteredArray);
        filteredArray.forEach(async (item) =>  {
          if(!grades.has(item.id)){
            const gradesDataResponse = await getGrades(item.id);
            setGrades(grades.set(item.id, gradesDataResponse[0].gradings));  
          }
        });
      }
      setCurrentIndex(proposalData.indexOf(prevProposal));
      fetchProposerData(prevProposal.proposer);
      fetchCommentsData(prevProposal.id);
    }
  };

  const searchInputChange = (event) => {
    const { value } = event.target;
    setQuery(value);
    if (value === '') {
      setProposersProposals(proposersProposalsFull);
    } else{
    
      const filteredProposals = proposersProposalsFull.filter(proposal => {
      return proposal.title.toLowerCase().includes(value.toLowerCase());
    });
      setProposersProposals(filteredProposals);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-EN', options).format(new Date(dateString));
  };
  return (
    <Div>
      <Div2>
        <Div3>
        <Link to={"/main"}>
          <LogoKaizen src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
          </Link>
          <Link to="/slider" style={{ textDecoration: 'none', marginTop: 57}}>
            <Button
              loading="lazy"
            ><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.16667 13.3333C3.93056 13.3333 3.73264 13.2535 3.57292 13.0937C3.41319 12.934 3.33333 12.7361 3.33333 12.5V10.8333H14.1667V3.33333H15.8333C16.0694 3.33333 16.2674 3.41319 16.4271 3.57292C16.5868 3.73264 16.6667 3.93056 16.6667 4.16667V16.6667L13.3333 13.3333H4.16667ZM0 12.5V0.833333C0 0.597222 0.0798611 0.399306 0.239583 0.239583C0.399306 0.0798611 0.597222 0 0.833333 0H11.6667C11.9028 0 12.1007 0.0798611 12.2604 0.239583C12.4201 0.399306 12.5 0.597222 12.5 0.833333V8.33333C12.5 8.56944 12.4201 8.76736 12.2604 8.92708C12.1007 9.08681 11.9028 9.16667 11.6667 9.16667H3.33333L0 12.5ZM10.8333 7.5V1.66667H1.66667V7.5H10.8333Z" fill="#7D7D7D"/>
            </svg>
            
            </Button>
          </Link>
          <Link to="/grading" style={{ textDecoration: 'none' }}>
            <Button1
              loading="lazy"
            ><svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.39333 13.0044L9.33333 11.3377L12.2733 13.0263L11.5033 9.86842L14.0933 7.76316L10.6867 7.47807L9.33333 4.49561L7.98 7.45614L4.57333 7.74123L7.16333 9.86842L6.39333 13.0044ZM3.57 16.6667L5.08667 10.5044L0 6.35965L6.72 5.8114L9.33333 0L11.9467 5.8114L18.6667 6.35965L13.58 10.5044L15.0967 16.6667L9.33333 13.3991L3.57 16.6667Z" fill="#2B8DC2"/>
            </svg>
            
            </Button1>
          </Link>
          <Link to="/after_grading" style={{ textDecoration: 'none' }}>
            <Button2
              loading="lazy"
            ><svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.6189 5.87494C9.6189 5.5033 9.92017 5.20203 10.2918 5.20203H16.6251C16.9968 5.20203 17.2981 5.5033 17.2981 5.87494C17.2981 6.24658 16.9968 6.54786 16.6251 6.54786H10.2918C9.92017 6.54786 9.6189 6.24658 9.6189 5.87494Z" fill="#7D7D7D" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1.70215 12.9999C1.70215 12.6283 2.00342 12.327 2.37507 12.327H8.7084C9.08004 12.327 9.38132 12.6283 9.38132 12.9999C9.38132 13.3716 9.08004 13.6729 8.7084 13.6729H2.37507C2.00342 13.6729 1.70215 13.3716 1.70215 12.9999Z" fill="#7D7D7D" />
                <path d="M7.125 5.875C7.125 7.18668 6.06168 8.25 4.75 8.25C3.43832 8.25 2.375 7.18668 2.375 5.875C2.375 4.56332 3.43832 3.5 4.75 3.5C6.06168 3.5 7.125 4.56332 7.125 5.875Z" fill="#7D7D7D" />
                <path d="M16.625 13C16.625 14.3117 15.5617 15.375 14.25 15.375C12.9383 15.375 11.875 14.3117 11.875 13C11.875 11.6883 12.9383 10.625 14.25 10.625C15.5617 10.625 16.625 11.6883 16.625 13Z" fill="#7D7D7D" />
              </svg>
            </Button2>
          </Link>
          <Link to="/proposals" style={{ textDecoration: 'none' }}>
            <Button3
              loading="lazy"
            ><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66667 16.394C1.20833 16.394 0.815972 16.2367 0.489583 15.9222C0.163194 15.6077 0 15.2296 0 14.7879V3.5455C0 3.10383 0.163194 2.72574 0.489583 2.41121C0.815972 2.09669 1.20833 1.93943 1.66667 1.93943H5.16667C5.34722 1.45762 5.64931 1.06949 6.07292 0.775041C6.49653 0.480596 6.97222 0.333374 7.5 0.333374C8.02778 0.333374 8.50347 0.480596 8.92708 0.775041C9.35069 1.06949 9.65278 1.45762 9.83333 1.93943H13.3333C13.7917 1.93943 14.184 2.09669 14.5104 2.41121C14.8368 2.72574 15 3.10383 15 3.5455V8.9258C14.7361 8.80534 14.4653 8.70162 14.1875 8.61462C13.9097 8.52763 13.625 8.46406 13.3333 8.4239V3.5455H1.66667V14.7879H6.70833C6.75 15.0824 6.81597 15.3634 6.90625 15.6311C6.99653 15.8988 7.10417 16.1531 7.22917 16.394H1.66667ZM1.66667 13.9849V14.7879V3.5455V8.4239V8.36368V13.9849ZM3.33333 13.1819H6.72917C6.77083 12.9008 6.83681 12.6264 6.92708 12.3588C7.01736 12.0911 7.11806 11.8301 7.22917 11.5758H3.33333V13.1819ZM3.33333 9.96974H8.41667C8.86111 9.56822 9.35764 9.23363 9.90625 8.96595C10.4549 8.69827 11.0417 8.51759 11.6667 8.4239V8.36368H3.33333V9.96974ZM3.33333 6.75762H11.6667V5.15156H3.33333V6.75762ZM7.5 2.94322C7.68055 2.94322 7.82986 2.88634 7.94792 2.77258C8.06597 2.65882 8.125 2.51494 8.125 2.34095C8.125 2.16696 8.06597 2.02308 7.94792 1.90932C7.82986 1.79556 7.68055 1.73868 7.5 1.73868C7.31944 1.73868 7.17014 1.79556 7.05208 1.90932C6.93403 2.02308 6.875 2.16696 6.875 2.34095C6.875 2.51494 6.93403 2.65882 7.05208 2.77258C7.17014 2.88634 7.31944 2.94322 7.5 2.94322ZM12.5 18C11.3472 18 10.3646 17.6086 9.55208 16.8256C8.73958 16.0427 8.33333 15.0957 8.33333 13.9849C8.33333 12.874 8.73958 11.9271 9.55208 11.1442C10.3646 10.3612 11.3472 9.96974 12.5 9.96974C13.6528 9.96974 14.6354 10.3612 15.4479 11.1442C16.2604 11.9271 16.6667 12.874 16.6667 13.9849C16.6667 15.0957 16.2604 16.0427 15.4479 16.8256C14.6354 17.6086 13.6528 18 12.5 18ZM12.0833 16.394H12.9167V14.3864H15V13.5834H12.9167V11.5758H12.0833V13.5834H10V14.3864H12.0833V16.394Z" fill="#7D7D7D" />
              </svg>
            </Button3>
          </Link>
          <Link to="/assigned" style={{ textDecoration: 'none' }}>
            <Button4
              loading="lazy"
            ><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75556 13.3778L13.0222 7.11111L11.7778 5.86667L6.75556 10.8889L4.22222 8.35556L2.97778 9.6L6.75556 13.3778ZM1.77778 17.7778C1.28889 17.7778 0.87037 17.6037 0.522222 17.2556C0.174074 16.9074 0 16.4889 0 16V3.55556C0 3.06667 0.174074 2.64815 0.522222 2.3C0.87037 1.95185 1.28889 1.77778 1.77778 1.77778H5.51111C5.7037 1.24444 6.02593 0.814815 6.47778 0.488889C6.92963 0.162963 7.43704 0 8 0C8.56296 0 9.07037 0.162963 9.52222 0.488889C9.97407 0.814815 10.2963 1.24444 10.4889 1.77778H14.2222C14.7111 1.77778 15.1296 1.95185 15.4778 2.3C15.8259 2.64815 16 3.06667 16 3.55556V16C16 16.4889 15.8259 16.9074 15.4778 17.2556C15.1296 17.6037 14.7111 17.7778 14.2222 17.7778H1.77778ZM1.77778 16H14.2222V3.55556H1.77778V16ZM8 2.88889C8.19259 2.88889 8.35185 2.82593 8.47778 2.7C8.6037 2.57407 8.66667 2.41481 8.66667 2.22222C8.66667 2.02963 8.6037 1.87037 8.47778 1.74444C8.35185 1.61852 8.19259 1.55556 8 1.55556C7.80741 1.55556 7.64815 1.61852 7.52222 1.74444C7.3963 1.87037 7.33333 2.02963 7.33333 2.22222C7.33333 2.41481 7.3963 2.57407 7.52222 2.7C7.64815 2.82593 7.80741 2.88889 8 2.88889Z" fill="#7D7D7D" />
              </svg>
            </Button4>
          </Link>
          <Link to="/proposers" style={{ textDecoration: 'none' }}>
            <Button5
              loading="lazy"
            ><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1665 9.50004C12.5832 9.50004 12.0901 9.29865 11.6873 8.89587C11.2846 8.4931 11.0832 8.00004 11.0832 7.41671C11.0832 6.83337 11.2846 6.34032 11.6873 5.93754C12.0901 5.53476 12.5832 5.33337 13.1665 5.33337C13.7498 5.33337 14.2429 5.53476 14.6457 5.93754C15.0484 6.34032 15.2498 6.83337 15.2498 7.41671C15.2498 8.00004 15.0484 8.4931 14.6457 8.89587C14.2429 9.29865 13.7498 9.50004 13.1665 9.50004ZM8.99984 13.6667V12.5C8.99984 12.1667 9.08664 11.8577 9.26025 11.573C9.43386 11.2882 9.68039 11.0834 9.99984 10.9584C10.4998 10.75 11.0172 10.5938 11.5519 10.4896C12.0866 10.3855 12.6248 10.3334 13.1665 10.3334C13.7082 10.3334 14.2464 10.3855 14.7811 10.4896C15.3158 10.5938 15.8332 10.75 16.3332 10.9584C16.6526 11.0834 16.8991 11.2882 17.0728 11.573C17.2464 11.8577 17.3332 12.1667 17.3332 12.5V13.6667H8.99984ZM7.33317 7.00004C6.4165 7.00004 5.63178 6.67365 4.979 6.02087C4.32623 5.3681 3.99984 4.58337 3.99984 3.66671C3.99984 2.75004 4.32623 1.96532 4.979 1.31254C5.63178 0.659763 6.4165 0.333374 7.33317 0.333374C8.24984 0.333374 9.03456 0.659763 9.68734 1.31254C10.3401 1.96532 10.6665 2.75004 10.6665 3.66671C10.6665 4.58337 10.3401 5.3681 9.68734 6.02087C9.03456 6.67365 8.24984 7.00004 7.33317 7.00004ZM0.666504 13.6667V11.3334C0.666504 10.8612 0.784559 10.4271 1.02067 10.0313C1.25678 9.63546 1.58317 9.33337 1.99984 9.12504C2.83317 8.70837 3.69775 8.38893 4.59359 8.16671C5.48942 7.94448 6.40261 7.83337 7.33317 7.83337C7.81928 7.83337 8.30539 7.87504 8.7915 7.95837C9.27761 8.04171 9.76373 8.13893 10.2498 8.25004L9.5415 8.95837L8.83317 9.66671C8.58317 9.59726 8.33317 9.55212 8.08317 9.53129C7.83317 9.51046 7.58317 9.50004 7.33317 9.50004C6.52761 9.50004 5.73942 9.59726 4.96859 9.79171C4.19775 9.98615 3.45817 10.2639 2.74984 10.625C2.61095 10.6945 2.50678 10.7917 2.43734 10.9167C2.36789 11.0417 2.33317 11.1806 2.33317 11.3334V12H7.33317V13.6667H0.666504ZM7.33317 5.33337C7.7915 5.33337 8.18386 5.17018 8.51025 4.84379C8.83664 4.5174 8.99984 4.12504 8.99984 3.66671C8.99984 3.20837 8.83664 2.81601 8.51025 2.48962C8.18386 2.16324 7.7915 2.00004 7.33317 2.00004C6.87484 2.00004 6.48248 2.16324 6.15609 2.48962C5.8297 2.81601 5.6665 3.20837 5.6665 3.66671C5.6665 4.12504 5.8297 4.5174 6.15609 4.84379C6.48248 5.17018 6.87484 5.33337 7.33317 5.33337Z" fill="#7D7D7D" />
              </svg>
            </Button5>
          </Link>
        </Div3>
        <Div4>
          <Div5>
            <Div6>Company name</Div6>
            <DropdownWrapper onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            <Div7>
              <Div8>
                <Img8
                  loading="lazy"
                  srcSet={"https://cdn.builder.io/api/v1/image/assets/TEMP/4dcf99f382750292c7d84a7df0227aaa7983b668cf36e9dfd3e8efa1f74f2292?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" || Logo}
                  alt="Person Image"
                  width="24"
                  height="24"
                />
                <Div9>{userData.first_name}</Div9>
              </Div8>
            </Div7>
            {isHovered && (    
                <DropdownMenu>
                  <Link to={`/profile/${userData.proposer.id}`} style={{textDecoration: 'none', color: '#333'}}> 
                  <DropdownItem>
                  <Div8>
                  <Div9>Profile</Div9>
              </Div8>
              <Img9
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/86686b16897beeac74304533d5bb958a4d1e0106aa55fd71c28f706a5b838225?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                onClick={logOut}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 6.5C5.60625 6.5 4.84115 6.18177 4.20469 5.54531C3.56823 4.90885 3.25 4.14375 3.25 3.25C3.25 2.35625 3.56823 1.59115 4.20469 0.954687C4.84115 0.318229 5.60625 0 6.5 0C7.39375 0 8.15885 0.318229 8.79531 0.954687C9.43177 1.59115 9.75 2.35625 9.75 3.25C9.75 4.14375 9.43177 4.90885 8.79531 5.54531C8.15885 6.18177 7.39375 6.5 6.5 6.5ZM0 13V10.725C0 10.2646 0.11849 9.84141 0.355469 9.45547C0.592448 9.06953 0.907292 8.775 1.3 8.57187C2.13958 8.15208 2.99271 7.83724 3.85937 7.62734C4.72604 7.41745 5.60625 7.3125 6.5 7.3125C7.39375 7.3125 8.27396 7.41745 9.14062 7.62734C10.0073 7.83724 10.8604 8.15208 11.7 8.57187C12.0927 8.775 12.4076 9.06953 12.6445 9.45547C12.8815 9.84141 13 10.2646 13 10.725V13H0ZM1.625 11.375H11.375V10.725C11.375 10.576 11.3378 10.4406 11.2633 10.3187C11.1888 10.1969 11.0906 10.1021 10.9688 10.0344C10.2375 9.66875 9.49948 9.39453 8.75469 9.21172C8.0099 9.02891 7.25833 8.9375 6.5 8.9375C5.74167 8.9375 4.9901 9.02891 4.24531 9.21172C3.50052 9.39453 2.7625 9.66875 2.03125 10.0344C1.90937 10.1021 1.8112 10.1969 1.73672 10.3187C1.66224 10.4406 1.625 10.576 1.625 10.725V11.375ZM6.5 4.875C6.94687 4.875 7.32943 4.71589 7.64766 4.39766C7.96589 4.07943 8.125 3.69687 8.125 3.25C8.125 2.80312 7.96589 2.42057 7.64766 2.10234C7.32943 1.78411 6.94687 1.625 6.5 1.625C6.05312 1.625 5.67057 1.78411 5.35234 2.10234C5.03411 2.42057 4.875 2.80312 4.875 3.25C4.875 3.69687 5.03411 4.07943 5.35234 4.39766C5.67057 4.71589 6.05312 4.875 6.5 4.875Z" fill="#C4C4C4"/>
                </svg>
              </Img9>
                  </DropdownItem>
                  </Link>
                  <DropdownItem onClick={logOut}>
                  <Div8>
                <Div9>Logout</Div9>
              </Div8>
              <Img9
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/86686b16897beeac74304533d5bb958a4d1e0106aa55fd71c28f706a5b838225?apiKey=76bc4e76ba824cf091e9566ff1ae9339&">
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0037 4.25V2.625C10.0037 2.19402 9.83123 1.7807 9.52423 1.47595C9.21722 1.1712 8.80084 1 8.36667 1H2.63704C2.20287 1 1.78648 1.1712 1.47948 1.47595C1.17247 1.7807 1 2.19402 1 2.625V12.375C1 12.806 1.17247 13.2193 1.47948 13.524C1.78648 13.8288 2.20287 14 2.63704 14H8.36667C8.80084 14 9.21722 13.8288 9.52423 13.524C9.83123 13.2193 10.0037 12.806 10.0037 12.375V10.75" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.27408 7.5H15.7333L13.2778 5.0625M13.2778 9.9375L15.7333 7.5" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Img9>
                  </DropdownItem>
                  </DropdownMenu>   
                      )}
            </DropdownWrapper>  
          </Div5>
          <Div10 className="slider-container">
            {(proposalData.length != 0) && (
              <Div11 className="slider">
                <Column>
                  {proposalData.map((data, index) => (
                    <Div12
                      className={`slide ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'slideToLeft' : index > currentIndex ? 'slideToRight' : ''}`}
                      key={data.id}
                    >
                      <Div13>
                        <Div14>{formatDate(data.created_at)}</Div14>
                        <Div15>
                          <SetSpecialistButton onClick={() => setShowCalendar(!showCalendar)}>Set a specialist</SetSpecialistButton>
                          <ArchiveButton onClick={archive}>Archive</ArchiveButton>
                        </Div15>
                        <Div19>
                          {currentIndex > 0 && <BackButton onClick={handleBack}>Back</BackButton>}
                          {currentIndex < proposalData.length - 1 && <NextButton onClick={handleNext}>Next</NextButton>}
                        </Div19>
                      </Div13>
                      <Div22 />
                      <Div23>
                        <Div24>
                          <Div25>{data.title}</Div25>
                          <Div26>{data.text}</Div26>
                        </Div24>
                        <Div27 />
                        <Div28>
                          <Div29>
                            <Div30>Comments</Div30>
                            <Div31>    {comments.length > 0 && (
    <div key={comments[comments.length - 1].id}>{comments[comments.length - 1].text}</div>
  )}</Div31>
                          </Div29>
                          <Comments  type="text" 
        placeholder="Your comments" 
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyPress={handleKeyPress}/>
                        </Div28>
                      </Div23>
                    </Div12>
                  ))}
                  <SearchInput>
                <SearchIcon src={searchIconSvg} alt="Search icon" />
                <input
                  type="text"
                  className='search_input'
                  value={query}
                  onChange={searchInputChange}
                  placeholder="Search"
                />
                </SearchInput>
                
                <TableWrapper>
      <TableHeader>
        <TableHeaderLabel className="headerLabel">Date</TableHeaderLabel>
        <TableHeaderLabel className='proposal_title headerLabel'>Proposal title</TableHeaderLabel>
        { 
          (() => {
            const reversedElements = [];
            gradingsData.slice().reverse().forEach((item, index) => {
              reversedElements.push(
                <TableHeaderLabel key={index} className="headerLabel">
                  {item.name}
                </TableHeaderLabel>
              );
            });
            return reversedElements;
          })()
        }
      </TableHeader>
      <TableBody>
        {proposersProposals.map((item, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableRowLabel style={{ width: headerLabelWidths[0] }}>{item.graded_at.split('T')[0]}</TableRowLabel>
            <TableRowLabel style={{ width: headerLabelWidths[1] }}>{item.title}</TableRowLabel>
            {grades.has(item.id) &&
              grades.get(item.id).map((gradings, index) => (
                <TableRowLabel key={index} style={{ width: headerLabelWidths[index + 2] }}>
                  {gradings.score}/{gradings.grading.score}
                </TableRowLabel>
              ))}
          </TableRow>
        ))}
      </TableBody>
    </TableWrapper>
                </Column>
                
                <Column2>
                  <>
                  <Container>
                  <ProfileCardWrapper>
                  <ProfileHeader>
                    <ProfileImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/8db8f9cf15e4a3b936231bc496dc49c62912c6702c17224a1648ebff8012758f?apiKey=f933b1b419864e2493a2da58c5eeea0a&" alt="Profile" loading="lazy" />
                    <ProfileInfo>
                      <ProfileName>{proposerData.user.last_name} {proposerData.user.first_name}</ProfileName>
                    </ProfileInfo>
                  </ProfileHeader>
                  <OffersSummary>
                    <OffersTitle>Offers</OffersTitle>
                    <TotalOffersTitle>Total offers</TotalOffersTitle>
                  </OffersSummary>
                  <Divider />
                  {proposerInfo.map((item, index) => (
                    <React.Fragment key={index}>
                      <OfferItem>
                        <OfferTitle>{item.title}</OfferTitle>
                        <OfferDetails>
                          <OfferValue>{item.value}</OfferValue>
                          <OfferDescription>{item.description}</OfferDescription>
                        </OfferDetails>
                      </OfferItem>
                      {index !== proposerInfo.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </ProfileCardWrapper>
                </Container>
                  </>
                </Column2>
              </Div11>
            )}

          </Div10>
          
        </Div4>
      </Div2>
      {showCalendar && <BackgroundOverlay />}
      {showCalendar && (
        <CalendarContainer ref={calendarRef}>
      <CalendarHeader>Set a specialist</CalendarHeader>
      <CalendarContent>
        <EmployeeCalendar>
          <EmployeeSearch>
          <input
                  type="text"
                  className='employee_search'
                  value={query}
                  onChange={employeeSearchHandler}
                  placeholder="Employee search"
                />
          </EmployeeSearch>
          <EmployeeItemWrapper>
          {selectedProposers.map((item, index) => (
            <EmployeeItem
            isSelected={index === selectedEmployee}
            onClick={() => handleEmployeeSelect(index)}
          >
            <CalendarCheckbox isSelected={index === selectedEmployee} />
            <EmployeeName>
              {item.user.first_name} {item.user.last_name} {item.department || ''}
            </EmployeeName>
          </EmployeeItem>
          )
          )}
          </EmployeeItemWrapper>
        </EmployeeCalendar>
        <CalendarSection>
          <StyledCalendar
            value={selectedDate}
            onChange={handleDateChange}
            tileDisabled={tileDisabled}
            minDate={new Date()}
          />
          <CalendarFooter>
            <SelectedDate>
              {selectedDate.getFullYear()} y. {selectedDate.getDate()}{" "}
              {selectedDate.toLocaleString("default", { month: "long" })}
            </SelectedDate>
            <AssignButton onClick={handleAssignClick}>Assign</AssignButton>
          </CalendarFooter>
        </CalendarSection>
      </CalendarContent>
    </CalendarContainer>
      )}
      
    </Div>
  );
}

const LogoKaizen = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const Div = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Div2 = styled.div`
  background-color: #f2f2f2;
  display: flex;
  padding-right: 10px;
  justify-content: space-between;
  gap: 11px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;
const Div3 = styled.div`
  position: fixed;
  height: 100%;
  z-index: 1;
  align-items: center;
  background-color: #fff;
  display: flex;
  flex-basis: 0%;
  flex-direction: column;
  padding: 42px 5px;
  @media (max-width: 991px) {
    display: none;
  }
`;
const Button = styled.button`
  aspect-ratio: 1;
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const Button1 = styled.button`
background-color:#ECF3FF;
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button2 = styled.button`
  border:none;
  aspect-ratio: 1;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button3 = styled.button`
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button4 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button5 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button6 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 370px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const Div4 = styled.div`
  margin-left: 60px;
  align-self: start;
  display: flex;
  margin-top: 5px;
  flex-grow: 1;
  flex-basis: 0%;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div5 = styled.div`
  display: flex;
  width: 100%;
  align-items: start;
  justify-content: space-between;
  gap: 20px;
  font-size: 16px;
  color: #5d5d5d;
  font-weight: 400;
  white-space: nowrap;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
  }
`;
const Div6 = styled.div`
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
  justify-content: center;
  padding: 13px 49px;
  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;
const DropdownWrapper = styled.div`
  width: 160px;
`;
const Div7 = styled.div`
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 13px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div8 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Img8 = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 24px;
`;
const Div9 = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const DropdownMenu = styled.div`
  z-index: 11;
  width: 160px;
  position: absolute;
  top: 45px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  border: 1px solid #d7d7d7;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 991px) {
    white-space: initial;
  }
  padding: 8px 12px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const Img9 = styled.button`
aspect-ratio: 1.15;
object-fit: auto;
object-position: center;
width: 15px;

cursor:pointer;
background: transparent;
border: none !important;
font-size:0;
margin: auto 0;
`;
const Div10 = styled.div`
  margin-top: 55px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;
const TableWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  margin-top: 17px;
  margin-bottom: 70px;
`;
const TableHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: #fff;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;
const TableHeaderLabel = styled.div`
  background-color: #fff;
  flex: 1;
  padding: 4px;
  border: 1px solid #d3d3d3;
  font-family: Roboto, sans-serif;
  font-size: 11px;
  display: flex;
  line-height: 1.3;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;
const TableBody = styled.div`
  display: flex;
  flex-direction: column;  
  @media (max-width: 991px) {
    margin-right: 5px;
  }
`;
const TableRow = styled.div`
  display: flex;
  
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;
const TableRowLabel = styled.div`
border: 1px solid #d3d3d3;
font-family: Roboto, sans-serif;
font-size: 11px;
padding: 8px 0;
display:flex;
align-items: center;
justify-content: center;
`;
const SearchInput = styled.div`
  z-index: 1;
  margin-top: 293px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    
  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;
const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const Div11 = styled.div`
  display: flex;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 70%;
  margin-left: 0px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;
const Div12 = styled.div`
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 3px 0 22px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 15px;
  }
`;
const Div13 = styled.div`
  display: flex;
  width: 100%;
  padding-right: 32px;
  justify-content: space-between;
  gap: 20px;
  color: #5d5d5d;
  font-weight: 400;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;
const Div14 = styled.div`
  font-family: Roboto, sans-serif;
  margin: auto 20px;
`;
const Div15 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const SetSpecialistButton = styled.button`
&:hover {
  transform: translateY(-5px);
  color: #333;
  cursor:pointer;
  box-shadow: .0rem .2rem .4rem #777;
  /* line I added */
  background-color:#ECF3FF;
  pointer-events: visible;
  position: relative;
  z-index: 0;
  visibility: visible;
  float: none;
}
  border:none;
  cursor:pointer;
  font-family: Roboto, sans-serif;
  border-radius: 8px 4px 4px 8px;
  background-color: #e6e6e6;
  flex-grow: 1;
  justify-content: center;
  padding: 13px 10px;
  
  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;
const ArchiveButton = styled.button`
&:hover {
  transform: translateY(-5px);
  color: #333;
  cursor:pointer;
  box-shadow: .0rem .2rem .4rem #777;
  /* line I added */
  background-color:#ECF3FF;
  pointer-events: visible;
  position: relative;
  z-index: 0;
  visibility: visible;
  float: none;
}
  border:none;
  cursor:pointer;
  font-family: Roboto, sans-serif;
  border-radius: 8px 4px 4px 8px;
  background-color: #e6e6e6;
  flex-grow: 1;
  justify-content: center;
  padding: 13px 27px;
  
  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;
const Div19 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const BackButton = styled.button`
cursor:pointer;
&:hover {
  transform: translateY(-5px);
  color: #333;
  cursor:pointer;
  box-shadow: .0rem .2rem .4rem #777;
  /* line I added */
  background-color:#ECF3FF;
  pointer-events: visible;
  position: relative;
  z-index: 0;
  visibility: visible;
  float: none;
}
border:none;
  font-family: Roboto, sans-serif;
  border-radius: 8px 4px 4px 8px;
  background-color: #e6e6e6;
  flex-grow: 1;
  justify-content: center;
  padding: 13px 21px;
  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;
const NextButton = styled.button`
&:hover {
  transform: translateY(-5px);
  color: #333;
  cursor:pointer;
  box-shadow: .0rem .2rem .4rem #777;
  /* line I added */
  background-color:#ECF3FF;
  pointer-events: visible;
  position: relative;
  z-index: 0;
  visibility: visible;
  float: none;
}
  cursor:pointer;
  border:none;
  font-family: Roboto, sans-serif;
  border-radius: 4px 8px 8px 4px;
  background-color: #e6e6e6;
  flex-grow: 1;
  justify-content: center;
  padding: 13px 38px 13px 17px;
  @media (max-width: 991px) {
    padding-right: 20px;
    white-space: initial;
  }
`;
const Div22 = styled.div`
  background-color: #e6e6e6;
  margin-top: 10px;
  height: 1px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div23 = styled.div`
  margin-left:20px;
  display: flex;
  margin-top: 18px;
  z-index:0;
  align-items: start;
  justify-content: space-between;
  gap: 35px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;
const Div24 = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div25 = styled.div`
  color: #3fc86e;
  font-family: Roboto, sans-serif;
  font-weight: 600;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div26 = styled.div`
  color: #5d5d5d;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  margin-top: 17px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div27 = styled.div`
  background-color: #e6e6e6;
  align-self: stretch;
  width: 1px;
  height: 174px;
`;
const Div28 = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  flex-direction: column;
  color: #5d5d5d;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div29 = styled.div`
  align-self: start;
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div30 = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 600;
`;
const Div31 = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  margin-top: 26px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Comments = styled.input`
  border:none;
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  background-color: #f2f2f2;
  margin-top: 24px;
  font-weight: 300;
  width:75%;
  padding: 14px 60px 70px 10px;
  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
`;
const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 30%;
  margin-left: 20px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;


const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-weight: 400;

  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;
const ProfileCardWrapper = styled.section`
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  max-width: 596px;
  flex-direction: column;
  align-items: start;
  padding: 17px;
  @media (max-width: 991px) {
    padding-right: 20px;
  }
`;

const ProfileHeader = styled.header`
  display: flex;
  gap: 18px;
  color: #525252;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileName = styled.h2`
  font: 500 18px Roboto, sans-serif;
  margin: 0;
`;


const OffersSummary = styled.div`
  display: flex;
  width: 100%;
  max-width: 282px;
  gap: 20px;
  font-size: 16px;
  color: #525252;
  font-weight: 500;
  justify-content: space-between;
  margin: 34px 0 0 45px;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const OffersTitle = styled.h3`
  font-family: Roboto, sans-serif;
  margin: 0;
`;

const TotalOffersTitle = styled.h3`
  font-family: Roboto, sans-serif;
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(230, 230, 230, 0.5);
  background-color: rgba(230, 230, 230, 0.5);
  width: 100%;
  max-width: 534px;
  margin: 13px 0 0 14px;
`;

const OfferItem = styled.div`
  display: flex;
  width: 100%;
  max-width: 299px;
  gap: 20px;
  font-weight: 400;
  justify-content: space-between;
  margin: 15px 0 0 44px;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const OfferTitle = styled.h4`
  color: #525252;
  margin: auto 0;
  font: 14px Roboto, sans-serif;
`;

const OfferDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const OfferValue = styled.p`
  color: #525252;
  font: 14px Roboto, sans-serif;
  margin: 0;
`;

const OfferDescription = styled.p`
  color: #7b7b7b;
  margin: 6px 0 0;
  font: 12px Roboto, sans-serif;
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
  z-index: 5;
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  max-width: 691px;
`;

const CalendarHeader = styled.header`
  border-radius: 8px 8px 0 0;
  background-color: #f5f6f7;
  color: #444950;
  padding: 11px 15px;
  font: 500 15px Roboto, sans-serif;
  @media (max-width: 991px) {
    padding-right: 20px;
  }
`;

const CalendarContent = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 991px) {
    flex-direction: column;
  }
`;

const EmployeeCalendar = styled.section`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 25px 0 0 21px;
  font-size: 15px;
  color: #444950;
  @media (max-width: 991px) {
    width: 100%;
    margin-left: 20px;
  }
`;

const EmployeeSearch = styled.div`
  border-radius: 8px;
  border: 1px solid #c4c4c4;
  background-color: #fff;
  color: #c4c4c4;
  padding: 12px 15px;
  font: 300 15px Roboto, sans-serif;
  @media (max-width: 991px) {
    padding-right: 20px;
  }
`;
const EmployeeItemWrapper = styled.div`
  width: 300px;
  max-height: 350px;
  overflow-y: auto;
`;
const EmployeeItem = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? "#ecf3ff" : "transparent")};
  padding: ${(props) => (props.isSelected ? "11px 17px 11px 5px" : "0")};
  margin-top: ${(props) => (props.isSelected ? "10px" : "21px")};
  cursor: pointer;
  @media (max-width: 991px) {
    margin-left: ${(props) => (props.isSelected ? "0" : "10px")};
  }
`;

const CalendarCheckbox = styled.span`
  border-radius: 9px;
  border: 1px solid ${(props) => (props.isSelected ? "#1877f2" : "#d3d3d3")};
  background-color: ${(props) => (props.isSelected ? "#ecf3ff" : "transparent")};
  width: 14px;
  height: 14px;
`;

const EmployeeName = styled.span`
  font: 400 15px Roboto, sans-serif;
`;

const CalendarSection = styled.section`
  border-radius: 0 8px 8px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  width: 50%;
  padding: 29px 0;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const StyledCalendar = styled(Calendar)`
  margin: 0 auto;
  .react-calendar {
    border: none;
    width: 100%;
    max-width: 100%;
    background: white;
    font-family: Roboto, sans-serif;
    line-height: 1.125em;
  }
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
    font-size: 16px;
    margin-top: 8px;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #f8f8fa;
  }
  .react-calendar__navigation button[disabled] {
    background-color: #f0f0f0;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    aspect-ratio: 1/1;
    max-width: 100%;
    background: none;
    text-align: center;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: #f8f8fa;
    color: #1871ed;
    border-radius: 8px;
  }
  .react-calendar__tile--now {
    background: #1871ed33;
    border-radius: 8px;
    font-weight: bold;
    color: #1871ed;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #1871ed33;
    border-radius: 8px;
    font-weight: bold;
    color: #1871ed;
  }
  .react-calendar__tile--hasActive {
    background: #76baff;
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }
  .react-calendar__tile--active {
    background: #1871ed;
    border-radius: 8px;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1871ed;
    color: white;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }
`;

const CalendarFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 0 26px;
`;

const SelectedDate = styled.span`
  font: 400 16px Roboto, sans-serif;
  color: #444950;
`;

const AssignButton = styled.button`
  border-radius: 8px;
  background-color: #1871ed;
  color: #fff;
  padding: 10px 30px;
  font: 400 18px Roboto, sans-serif;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 16px 20px;
  }
`;


export default OpenProposal;