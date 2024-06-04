import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Spinner from '../spinner/spinner';
import searchIconSvg from '../../images/search-icon.svg';
import checkboxArrowSvg from '../../images/checkbox-arrow.svg';
import { fetchUserData, fetchProposalData, fetchProposersData } from '../../services/apiService';
import Avatar from '../../images/User-512.webp';
import { Link } from 'react-router-dom';
import { DateRangePicker, Stack } from 'rsuite';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import '../CSS/style.css';

export const logOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  window.location.href = "../login";
};


function AfterGradingComponent(props) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalData, setProposalData] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [proposersData, setProposersData] = useState(null);
  const [query, setQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [, setIsChecked] = useState(false);


  const predefinedRanges = [
    {
      label: 'Today',
      value: [new Date(), new Date()],
      placement: 'left'
    },
    {
      label: 'Yesterday',
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: 'left'
    },
    {
      label: 'This week',
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: 'left'
    },
    {
      label: 'Last 7 days',
      value: [subDays(new Date(), 6), new Date()],
      placement: 'left'
    },
    {
      label: 'Last 30 days',
      value: [subDays(new Date(), 29), new Date()],
      placement: 'left'
    },
    {
      label: 'This month',
      value: [startOfMonth(new Date()), new Date()],
      placement: 'left'
    },
    {
      label: 'Last month',
      value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
      placement: 'left'
    },
    {
      label: 'This year',
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: 'left'
    },
    {
      label: 'Last year',
      value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
      placement: 'left'
    },
    {
      label: 'All time',
      value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
      placement: 'left'
    },
    {
      label: 'Last week',
      closeOverlay: false,
      value: value => {
        const [start = new Date()] = value || [];
        return [
          addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
          addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
        ];
      },
      appearance: 'default'
    },
    {
      label: 'Next week',
      closeOverlay: false,
      value: value => {
        const [start = new Date()] = value || [];
        return [
          addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
          addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
        ];
      },
      appearance: 'default'
    }
  ];

  const checkbox = (event) => {
    setIsChecked(event.target.checked);
  };

  const [, setError] = useState(null);
  let rowNum = 0
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await fetchUserData();
        const proposalData = await fetchProposalData();
        const proposersData = await fetchProposersData()
        setProposalData(proposalData);
        setProposals(proposalData);
        setUserData(userDataResponse);

        setLoading(false);

        console.log('Proposal Data:', proposalData);
        console.log('User Data:', userDataResponse);
        const transformedData = {};
        proposersData.forEach((item) => {
          transformedData[item.id] = item;
        });
        console.log('Proposer Data:', transformedData);
        setProposersData(transformedData)
      } catch (error) {
        setError(error.message);

        console.error('Error fetching user data:', error);
        window.location.href = "../login";
      }
    };

    fetchData();
  }, []);


  const handleInputChange = (event) => {
    const { value } = event.target;
    setQuery(value);
    if (value === '') {
      setProposals(proposalData);
    } else{
    
    const filteredProposals = proposalData.filter(proposal => {
      const fullName = `${proposersData[proposal.proposer].user.first_name} ${proposersData[proposal.proposer].user.last_name}`;
      return fullName.toLowerCase().includes(value.toLowerCase()) || proposal.text.toLowerCase().includes(value.toLowerCase());
    });
      setProposals(filteredProposals);
    }
  };

  const [, setdateData] = useState([]);

  const dateSelected = (selectedDate) => {
    const date1 = new Date(selectedDate[0]).setHours(0, 0, 0, 0);
    const date2 = new Date(selectedDate[1]).setHours(0, 0, 0, 0);

    setdateData([date1, date2]);

    // const filteredProposals = proposals.filter(proposal => {
    //   const created_date = new Date(proposal.created_at).setHours(0, 0, 0, 0);
    //   if (created_date >= date1 && created_date <= date2 ) {
    //   return true;
    //   }
    //   return false;
    // });
    //   setProposals(filteredProposals);
  };

  const dateClean = () => {
    // if(query != ''){
    //   const filteredProposalsBySearch = proposalData.filter(proposal => {
    //     const fullName = `${proposerData[proposal.proposer].user.first_name} ${proposerData[proposal.proposer].user.last_name}`;
    //     return fullName.toLowerCase().includes(query.toLowerCase()) || proposal.text.toLowerCase().includes(query.toLowerCase());
    //   });

    //   if(selectedOption != 'filter by'){
    //     const filteredProposalsByStatus = filteredProposalsBySearch.filter(proposal => {
    //       return proposal.status == selectedOption;
    //     });
    //     setProposals(filteredProposalsByStatus);
    //   } else {
    //   }
    // }
    // else {
    //   if(selectedOption != 'filter by'){
    //     const filteredProposalsByStatus = proposalData.filter(proposal => {
    //       return proposal.status == selectedOption;
    //     });
    //     setProposals(filteredProposalsByStatus);
    //   } else {
    //     setProposals(proposalData);
      
    // } 
  }

  const [isDrop, setIsDrop] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Filter By");

  const options = [
    "Date Graded",
    "Date Accepted",
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const filteredProposals = proposals.filter(proposal => {
      return proposal.status === option;
    });
    setIsOpen(false);
    setProposals(filteredProposals);
      
  };

  const clearSelection = () => {
    setSelectedOption("Filter By");
    if(query === '') {
      setProposals(proposalData);
    } else {
      const filteredProposalsBySearch = proposalData.filter(proposal => {
      const fullName = `${proposersData[proposal.proposer].user.first_name} ${proposersData[proposal.proposer].user.last_name}`;
      return fullName.toLowerCase().includes(query.toLowerCase()) || proposal.text.toLowerCase().includes(query.toLowerCase());
        });
      setProposals(filteredProposalsBySearch);
    }
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("ENG");
  const languages = ["ENG", "РУС", "ҚАЗ"];

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const filteredLanguages = languages.filter(lang => lang !== selectedLanguage);
  
  if (loading) {
    return <Spinner />;
  }
  return (
    <Div>
      <Div2>
        <Div3>
          <Link to="/proposers" style={{ textDecoration: 'none' }}>
          <Link to={"/main"}>
          <LogoKaizen src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
        </Link>
          </Link>
          <Link to="/slider">
          <Button
            loading="lazy"
          ><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.16667 13.3333C3.93056 13.3333 3.73264 13.2535 3.57292 13.0937C3.41319 12.934 3.33333 12.7361 3.33333 12.5V10.8333H14.1667V3.33333H15.8333C16.0694 3.33333 16.2674 3.41319 16.4271 3.57292C16.5868 3.73264 16.6667 3.93056 16.6667 4.16667V16.6667L13.3333 13.3333H4.16667ZM0 12.5V0.833333C0 0.597222 0.0798611 0.399306 0.239583 0.239583C0.399306 0.0798611 0.597222 0 0.833333 0H11.6667C11.9028 0 12.1007 0.0798611 12.2604 0.239583C12.4201 0.399306 12.5 0.597222 12.5 0.833333V8.33333C12.5 8.56944 12.4201 8.76736 12.2604 8.92708C12.1007 9.08681 11.9028 9.16667 11.6667 9.16667H3.33333L0 12.5ZM10.8333 7.5V1.66667H1.66667V7.5H10.8333Z" fill="#7D7D7D"/>
            </svg>

          </Button>
          </Link>
          <Link to="/grading">
          <Button1
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/be1e262c51b781adefde1ed54a742d841941ec89f676a85721792f38bc9ac061?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
          ><svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.39333 13.0044L9.33333 11.3377L12.2733 13.0263L11.5033 9.86842L14.0933 7.76316L10.6867 7.47807L9.33333 4.49561L7.98 7.45614L4.57333 7.74123L7.16333 9.86842L6.39333 13.0044ZM3.57 16.6667L5.08667 10.5044L0 6.35965L6.72 5.8114L9.33333 0L11.9467 5.8114L18.6667 6.35965L13.58 10.5044L15.0967 16.6667L9.33333 13.3991L3.57 16.6667Z" fill="#7D7D7D" />
            </svg>
          </Button1>
          </Link>
          <Link to="/after_grading">
          <Button2
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c076e6824233e52b16e32cf78756a71928a23aa05c184db05634c92927feb03f?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
          ><svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.6189 5.87494C9.6189 5.5033 9.92017 5.20203 10.2918 5.20203H16.6251C16.9968 5.20203 17.2981 5.5033 17.2981 5.87494C17.2981 6.24658 16.9968 6.54786 16.6251 6.54786H10.2918C9.92017 6.54786 9.6189 6.24658 9.6189 5.87494Z" fill="#2B8DC2" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.70215 12.9999C1.70215 12.6283 2.00342 12.327 2.37507 12.327H8.7084C9.08004 12.327 9.38132 12.6283 9.38132 12.9999C9.38132 13.3716 9.08004 13.6729 8.7084 13.6729H2.37507C2.00342 13.6729 1.70215 13.3716 1.70215 12.9999Z" fill="#2B8DC2" />
              <path d="M7.125 5.875C7.125 7.18668 6.06168 8.25 4.75 8.25C3.43832 8.25 2.375 7.18668 2.375 5.875C2.375 4.56332 3.43832 3.5 4.75 3.5C6.06168 3.5 7.125 4.56332 7.125 5.875Z" fill="#2B8DC2" />
              <path d="M16.625 13C16.625 14.3117 15.5617 15.375 14.25 15.375C12.9383 15.375 11.875 14.3117 11.875 13C11.875 11.6883 12.9383 10.625 14.25 10.625C15.5617 10.625 16.625 11.6883 16.625 13Z" fill="#2B8DC2" />
            </svg>
          </Button2>
          </Link>
          <Link to="/proposals">
          <Button3
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/11090c7aac88afef2d142d5d27a3ad7894848a709c7f10afa40b6467f9bf0b7f?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
          ><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.66667 16.394C1.20833 16.394 0.815972 16.2367 0.489583 15.9222C0.163194 15.6077 0 15.2296 0 14.7879V3.5455C0 3.10383 0.163194 2.72574 0.489583 2.41121C0.815972 2.09669 1.20833 1.93943 1.66667 1.93943H5.16667C5.34722 1.45762 5.64931 1.06949 6.07292 0.775041C6.49653 0.480596 6.97222 0.333374 7.5 0.333374C8.02778 0.333374 8.50347 0.480596 8.92708 0.775041C9.35069 1.06949 9.65278 1.45762 9.83333 1.93943H13.3333C13.7917 1.93943 14.184 2.09669 14.5104 2.41121C14.8368 2.72574 15 3.10383 15 3.5455V8.9258C14.7361 8.80534 14.4653 8.70162 14.1875 8.61462C13.9097 8.52763 13.625 8.46406 13.3333 8.4239V3.5455H1.66667V14.7879H6.70833C6.75 15.0824 6.81597 15.3634 6.90625 15.6311C6.99653 15.8988 7.10417 16.1531 7.22917 16.394H1.66667ZM1.66667 13.9849V14.7879V3.5455V8.4239V8.36368V13.9849ZM3.33333 13.1819H6.72917C6.77083 12.9008 6.83681 12.6264 6.92708 12.3588C7.01736 12.0911 7.11806 11.8301 7.22917 11.5758H3.33333V13.1819ZM3.33333 9.96974H8.41667C8.86111 9.56822 9.35764 9.23363 9.90625 8.96595C10.4549 8.69827 11.0417 8.51759 11.6667 8.4239V8.36368H3.33333V9.96974ZM3.33333 6.75762H11.6667V5.15156H3.33333V6.75762ZM7.5 2.94322C7.68055 2.94322 7.82986 2.88634 7.94792 2.77258C8.06597 2.65882 8.125 2.51494 8.125 2.34095C8.125 2.16696 8.06597 2.02308 7.94792 1.90932C7.82986 1.79556 7.68055 1.73868 7.5 1.73868C7.31944 1.73868 7.17014 1.79556 7.05208 1.90932C6.93403 2.02308 6.875 2.16696 6.875 2.34095C6.875 2.51494 6.93403 2.65882 7.05208 2.77258C7.17014 2.88634 7.31944 2.94322 7.5 2.94322ZM12.5 18C11.3472 18 10.3646 17.6086 9.55208 16.8256C8.73958 16.0427 8.33333 15.0957 8.33333 13.9849C8.33333 12.874 8.73958 11.9271 9.55208 11.1442C10.3646 10.3612 11.3472 9.96974 12.5 9.96974C13.6528 9.96974 14.6354 10.3612 15.4479 11.1442C16.2604 11.9271 16.6667 12.874 16.6667 13.9849C16.6667 15.0957 16.2604 16.0427 15.4479 16.8256C14.6354 17.6086 13.6528 18 12.5 18ZM12.0833 16.394H12.9167V14.3864H15V13.5834H12.9167V11.5758H12.0833V13.5834H10V14.3864H12.0833V16.394Z" fill="#7D7D7D" />
            </svg>

          </Button3>
          </Link> 
          <Button4
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/896eb868d3ad13ba5210775d6114fa338f0956edcd8c1150ae371165e3f01a7b?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
          ><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75556 13.3778L13.0222 7.11111L11.7778 5.86667L6.75556 10.8889L4.22222 8.35556L2.97778 9.6L6.75556 13.3778ZM1.77778 17.7778C1.28889 17.7778 0.87037 17.6037 0.522222 17.2556C0.174074 16.9074 0 16.4889 0 16V3.55556C0 3.06667 0.174074 2.64815 0.522222 2.3C0.87037 1.95185 1.28889 1.77778 1.77778 1.77778H5.51111C5.7037 1.24444 6.02593 0.814815 6.47778 0.488889C6.92963 0.162963 7.43704 0 8 0C8.56296 0 9.07037 0.162963 9.52222 0.488889C9.97407 0.814815 10.2963 1.24444 10.4889 1.77778H14.2222C14.7111 1.77778 15.1296 1.95185 15.4778 2.3C15.8259 2.64815 16 3.06667 16 3.55556V16C16 16.4889 15.8259 16.9074 15.4778 17.2556C15.1296 17.6037 14.7111 17.7778 14.2222 17.7778H1.77778ZM1.77778 16H14.2222V3.55556H1.77778V16ZM8 2.88889C8.19259 2.88889 8.35185 2.82593 8.47778 2.7C8.6037 2.57407 8.66667 2.41481 8.66667 2.22222C8.66667 2.02963 8.6037 1.87037 8.47778 1.74444C8.35185 1.61852 8.19259 1.55556 8 1.55556C7.80741 1.55556 7.64815 1.61852 7.52222 1.74444C7.3963 1.87037 7.33333 2.02963 7.33333 2.22222C7.33333 2.41481 7.3963 2.57407 7.52222 2.7C7.64815 2.82593 7.80741 2.88889 8 2.88889Z" fill="#7D7D7D" />
            </svg>
          </Button4>        
          <Link to="/proposers">
          <Button5
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5cad224f16a6fc23c80847beab1b9c8c6e9a264bf0234be196d73358c85e00fd?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
          ><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.1665 9.50004C12.5832 9.50004 12.0901 9.29865 11.6873 8.89587C11.2846 8.4931 11.0832 8.00004 11.0832 7.41671C11.0832 6.83337 11.2846 6.34032 11.6873 5.93754C12.0901 5.53476 12.5832 5.33337 13.1665 5.33337C13.7498 5.33337 14.2429 5.53476 14.6457 5.93754C15.0484 6.34032 15.2498 6.83337 15.2498 7.41671C15.2498 8.00004 15.0484 8.4931 14.6457 8.89587C14.2429 9.29865 13.7498 9.50004 13.1665 9.50004ZM8.99984 13.6667V12.5C8.99984 12.1667 9.08664 11.8577 9.26025 11.573C9.43386 11.2882 9.68039 11.0834 9.99984 10.9584C10.4998 10.75 11.0172 10.5938 11.5519 10.4896C12.0866 10.3855 12.6248 10.3334 13.1665 10.3334C13.7082 10.3334 14.2464 10.3855 14.7811 10.4896C15.3158 10.5938 15.8332 10.75 16.3332 10.9584C16.6526 11.0834 16.8991 11.2882 17.0728 11.573C17.2464 11.8577 17.3332 12.1667 17.3332 12.5V13.6667H8.99984ZM7.33317 7.00004C6.4165 7.00004 5.63178 6.67365 4.979 6.02087C4.32623 5.3681 3.99984 4.58337 3.99984 3.66671C3.99984 2.75004 4.32623 1.96532 4.979 1.31254C5.63178 0.659763 6.4165 0.333374 7.33317 0.333374C8.24984 0.333374 9.03456 0.659763 9.68734 1.31254C10.3401 1.96532 10.6665 2.75004 10.6665 3.66671C10.6665 4.58337 10.3401 5.3681 9.68734 6.02087C9.03456 6.67365 8.24984 7.00004 7.33317 7.00004ZM0.666504 13.6667V11.3334C0.666504 10.8612 0.784559 10.4271 1.02067 10.0313C1.25678 9.63546 1.58317 9.33337 1.99984 9.12504C2.83317 8.70837 3.69775 8.38893 4.59359 8.16671C5.48942 7.94448 6.40261 7.83337 7.33317 7.83337C7.81928 7.83337 8.30539 7.87504 8.7915 7.95837C9.27761 8.04171 9.76373 8.13893 10.2498 8.25004L9.5415 8.95837L8.83317 9.66671C8.58317 9.59726 8.33317 9.55212 8.08317 9.53129C7.83317 9.51046 7.58317 9.50004 7.33317 9.50004C6.52761 9.50004 5.73942 9.59726 4.96859 9.79171C4.19775 9.98615 3.45817 10.2639 2.74984 10.625C2.61095 10.6945 2.50678 10.7917 2.43734 10.9167C2.36789 11.0417 2.33317 11.1806 2.33317 11.3334V12H7.33317V13.6667H0.666504ZM7.33317 5.33337C7.7915 5.33337 8.18386 5.17018 8.51025 4.84379C8.83664 4.5174 8.99984 4.12504 8.99984 3.66671C8.99984 3.20837 8.83664 2.81601 8.51025 2.48962C8.18386 2.16324 7.7915 2.00004 7.33317 2.00004C6.87484 2.00004 6.48248 2.16324 6.15609 2.48962C5.8297 2.81601 5.6665 3.20837 5.6665 3.66671C5.6665 4.12504 5.8297 4.5174 6.15609 4.84379C6.48248 5.17018 6.87484 5.33337 7.33317 5.33337Z" fill="#7D7D7D" />
            </svg>
          </Button5>
          </Link>
        </Div3>
        <Div4>
          <Div5>
            <Div6>Company name</Div6>
            <Div51>
              <LanguageSelectorWrapper onClick={() => setIsOpen(!isOpen)}>
                <LanguageCode>
                  {selectedLanguage}
                </LanguageCode>
                <LanguagePolygon
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/69cb4c3f10bd0f7645f561142580659d248d57013fd8dbb5c0398dc17e52ffff?apiKey=f933b1b419864e2493a2da58c5eeea0a&"
                  alt="Language selector icon"
                  
                />
                {isOpen && (
                  <LanguageDropdown>
                    {filteredLanguages.map(language => (
                      <LanguageOption key={language} onClick={() => handleLanguageClick(language)}>
                        {language}
                      </LanguageOption>
                    ))}
                  </LanguageDropdown>
                )}
              </LanguageSelectorWrapper>

              <DropdownWrapper onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            <Div7>
              <Div8>
                <Img8
                  loading="lazy"
                  srcSet={"https://cdn.builder.io/api/v1/image/assets/TEMP/4dcf99f382750292c7d84a7df0227aaa7983b668cf36e9dfd3e8efa1f74f2292?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" || `/User-512.webp`}
                  alt="Person Image"
                  width="24"
                  height="24"
                />
                <Div9>{userData.first_name}</Div9>
              </Div8>
            </Div7>
            {isHovered && (    
                <DropdownMenu>
                <DropdownItem>
                    <Div8>
                        <Div9>Home</Div9>
                    </Div8>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M264-216h132v-234h168v234h132v-348L480-728 264-564v348Zm-20 20v-378l236-179 236 179v378H544v-234H416v234H244Zm236-276Z"/></svg>
                </DropdownItem>
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
            </Div51>
            
          </Div5>
          <Div10>
            <Div50>
              <FilterWrapper>
              <SearchInput>
                <SearchIcon src={searchIconSvg} alt="Search icon" />
                <input
                  type="text"
                  value={query}
                  className='search_input'
                  onChange={handleInputChange}
                  placeholder="Search"
                />
              </SearchInput>
              <Stack>
                <DateRangePicker
                  onOk={dateSelected}
                  onClean={dateClean}
                  className='dateRangePicker'
                  size="lg"
                  ranges={predefinedRanges}
                  placeholder="Proposals date range"
                  style={{ width: 300 }}
                  onShortcutClick={(range) => {
                    dateSelected(range.value);
                  }}
                />
              </Stack>
              <div className="dropdown">
                <button className="dropbtn" onClick={() => setIsDrop(!isOpen)}>{selectedOption} {selectedOption !== "filter by" && <span className="clear" onClick={(e) => {e.stopPropagation(); clearSelection()}}>x</span>}</button>
                {isDrop && (
                  <div className="dropdown-content">
                    {options.map((option, index) => (
                      <button key={index} onClick={() => handleOptionSelect(option)}>{option}</button>
                    ))}
                  </div>
                )}
              </div>
              </FilterWrapper>
            </Div50>
            <Container>
              <Header>
                <HeaderWrapper className='RatedText'>Rated</HeaderWrapper>
              </Header>
              <Table>
                <Divider />
                <TableHeader>
                <TableHeaderLeft>
                  <TableHeaderLabels>
                    <TableHeaderLabel className="header_number">№</TableHeaderLabel>
                    <TableHeaderLabel className="header_name">Name</TableHeaderLabel>
                    <TableHeaderLabel className="header_surname">Surname</TableHeaderLabel>
                    <TableHeaderLabel className="header_proposals">Proposals</TableHeaderLabel>
                  </TableHeaderLabels>
                </TableHeaderLeft>
                <TableHeaderRight>
                  <TableHeaderLabel className="header_points">Points</TableHeaderLabel>
                  <TableHeaderLabel className="header_grade">Grade</TableHeaderLabel>
                  <TableHeaderLabel className="header_date_graded">Date graded</TableHeaderLabel>
                  <TableHeaderLabel className="header_date_accepted">Date accepted</TableHeaderLabel>
                  <TableHeaderLabel className="header_status">Status</TableHeaderLabel>
                  <TableHeaderLabel className="header_actions">Actions</TableHeaderLabel>
                </TableHeaderRight>
              </TableHeader>
              <TableBody>
              {proposals.map((item) => (
                (item.status === 'Graded') ? (
                  <TableRow>
                    <TableRowLabel className="row_number">{++rowNum}</TableRowLabel>
                    <TableRowLabel className="row_name">{proposersData[item.proposer].user.first_name}</TableRowLabel>
                    <TableRowLabel className="row_surname">{proposersData[item.proposer].user.last_name}</TableRowLabel>
                    <TableRowLabel className="row_proposal">{item.text}</TableRowLabel>
                    <TableRowLabel className="row_points">{item.total_score}</TableRowLabel>
                    <TableRowLabel className="row_grade">{item.grade_percentage}</TableRowLabel>
                    <TableRowLabel className="row_date_graded">{item.graded_at.split('T')[0]}</TableRowLabel>
                    <TableRowLabel className="row_date_accepted">{item.accepted_at.split('T')[0]}</TableRowLabel>
                    <TableRowLabel className="row_status" status={item.status}>{item.status}</TableRowLabel>
                    <TableRowLabel className='row_actions'>
                      <ActionIcon loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/45ba6e34c4feb0d1b52792ce057608876be231e17318d83a73a051445a2210ec?apiKey=f933b1b419864e2493a2da58c5eeea0a&" alt="Action Icon" />
                      <ActionIcon loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0539ef010e404541cac233bb9e81504535f80b90b240f64a9e5f8bd27bf3a7a1?apiKey=f933b1b419864e2493a2da58c5eeea0a&" alt="Action Icon" />
                    </TableRowLabel>
                  </TableRow>
                ) : null
              ))}
              </TableBody>
              </Table>
              
              <Divider />
    </Container> 
          </Div10>
        </Div4>
      </Div2>
    </Div>
  );
}

const getStatusColor = (status) => {
  switch(status) {
    case 'New':
      return '#1871ED';
    case 'Accepted':
      return '#63BE09';
    case 'Declined':
      return '#BE2A09';
    default:
      return '';
  }
};

const LogoKaizen = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const Div = styled.div`
  background-color: #fff;
  display: flex;
  margin: 0px;
  flex-direction: column;
  justify-content: center;
`;
const Div2 = styled.div`
  height: 100vh;
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
  z-index: 1;
  height: 100%;
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
  margin-top: 57px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const Button1 = styled.button`
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
  background-color:#ECF3FF;
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

const Div51 = styled.div`
  display: flex;
  `;

const LanguageSelectorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(215, 215, 215, 1);
  border-radius: 8px;
  background-color: #fff;
  font-size: 16px;
  color: #525252;
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
`;

const LanguageCode = styled.span`
  font-family: Roboto, sans-serif;
`;

const LanguagePolygon = styled.img`
  width: 15px;
  aspect-ratio: 1.89;
  object-fit: contain;
  fill: #434343;
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid rgba(215, 215, 215, 1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LanguageOption = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  color: #525252;
  cursor: pointer;

  &:hover {
    color: #000;
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
const Div50 = styled.div`
  margin: 12px 0 8px 0;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;
const Div10 = styled.div`
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 5px;
  height: 40px;

  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 15px;
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


const Container = styled.div`
  display: flex;
  flex-direction: column;
  fill: #fff;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.2));
  overflow: hidden;
  position: relative;
  padding-bottom: 8px;
`;


const Header = styled.header`
  position: relative;
  display: flex;
  width: 1191px;
  max-width: 100%;
  gap: 15px;
  font-size: 16px;
  font-weight: 500;
  
  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;

const HeaderWrapper = styled.div`
  border-radius: 8px 8px 0px 0px;
  box-shadow: 0px -5px 5px -5px rgba(0, 0, 0, 0.2);
  background-color: #fafafa;
  font-weight: bold;
  display: flex;
  color: #6c6c6c;
  
  &.RatedText {
    font-size: 20px;
    padding: 11px 450px 12px 30px;
    color: #1871ed;
    font-family: Roboto, sans-serif;
    margin: auto 0;
  }
  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;

const Divider = styled.div`
  position: relative;
  background-color: #d3d3d3;
  margin-top: 6px;
  width: 100%;
  
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const Table = styled.div`
  background-color: #fafafa;
  border-radius: 0 8px 8px 8px;
`;

const TableHeader = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;

const TableHeaderLeft = styled.div`
  display: flex;
`;

const CheckboxWrapper = styled.div`
  border: 1px solid #d3d3d3;
  padding: 11px 18px 11px 6px;
  display:flex;
  align-items: center;
&.header_checkbox{
  padding: 7px 7px 7px 6px;
  display: flex;
  gap: 2px;
} 

`;

const Checkbox = styled.div`
  border: 1px solid rgba(211, 211, 211, 1);
  border-radius: 6px;
  background-color: #fff;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;


const CheckboxIcon = styled.img``;

const TableRowLabel = styled.div`
border: 1px solid #d3d3d3;
font-family: Roboto, sans-serif;
font-size: 11px;
display:flex;
align-items: center;
justify-content: center;
&.row_number {
  min-width: 30px;
}

&.row_name {
  padding-left: 10px;
  justify-content: start;
  width: 80px;
}

&.row_surname {
  padding-left: 13px;
  justify-content: start;
  width: 80px;
}

&.row_proposal {
  padding: 7px 0 7px 17px;
  justify-content: start;
  width: 645px;
  line-height: 1.5;
}

&.row_points {
  padding-left: 14px;
  justify-content: start;
  min-width: 54px;
}

&.row_grade {
  padding-left: 14px;
  justify-content: start;
  min-width: 68px;
}

&.row_date_graded {
  padding-left: 13px;
  justify-content: start;
  min-width: 82px;
}

&.row_date_accepted {
  padding-left: 5px;
  justify-content: start;
  min-width: 86px;
}

&.row_status {
  padding-left: 16px;
  justify-content: start;
  min-width: 84px;
  color: ${props => getStatusColor(props.status)};
}

&.row_actions {
  gap: 10px;
  padding-left: 19px;
  justify-content: start;
  min-width: 84px;
}
`;

const TableHeaderLabels = styled.div`
  display: flex;
  font-size: 12px;
  color: #434343;
  font-weight: 500;
  white-space: nowrap;
  
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const TableHeaderLabel = styled.div`
  border: 1px solid #d3d3d3;
  font-family: Roboto, sans-serif;
  display:flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  &.header_number {
    min-width: 30px;
  }

  &.header_name {
    padding-left: 10px;
    justify-content: start;
    width: 80px;
  }

  &.header_surname {
    padding-left: 13px;
    justify-content: start;
    width: 80px;
  }

  &.header_proposals {
    padding: 7px 0 7px 17px;
    justify-content: start;
    width: 645px;
    line-height: 1.5;
  }

  &.header_points {
    padding-left: 14px;
    justify-content: start;
    min-width: 54px;
  }

  &.header_grade {
    padding-left: 14px;
    justify-content: start;
    min-width: 68px;
  }

  &.header_date_graded {
    padding-left: 13px;
    justify-content: start;
    min-width: 82px;
  }

  &.header_date_accepted {
    padding-left: 5px;
    justify-content: start;
    min-width: 86px;
  }

  &.header_status {
    padding-left: 16px;
    justify-content: start;
    min-width: 84px;
    color: ${props => getStatusColor(props.status)};
  }

  &.header_actions {
    gap: 10px;
    padding-left: 19px;
    justify-content: start;
    min-width: 84px;
  }
`;

const TableHeaderRight = styled.div`
  display: flex;
  font-size: 12px;
  color: #434343;
  font-weight: 500;
  justify-content: space-between;  
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;



const TableBody = styled.div`
  position: relative;
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

const ActionIcon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 13px;
  fill: #8f8f8f;
`;

const Footer = styled.footer`
  position: absolute;
  display: flex;
  bottom: 0;
  width: 197px;
  max-width: 100%;
  gap: 20px;
  font-size: 12px;
  color: #494949;
  font-weight: 400;
  justify-content: space-between;
  margin: 10px 0 0 43px;
  
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

const FooterPageNumber = styled.div`
  text-align: center;
  font-family: Roboto, sans-serif;
`;

const FooterPageTotal = styled.div`
  font-family: Roboto, sans-serif;
`;

const FooterTotal = styled.div`
  font-family: Roboto, sans-serif;
`;
export default AfterGradingComponent;