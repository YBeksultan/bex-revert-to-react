import React, { useState } from "react";
import styled from "styled-components";
import Spinner from '../spinner/spinner';
import { registration, checkNewByEmail } from "../../services/apiService";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import toast, { Toaster } from 'react-hot-toast';
import '../CSS/style.css'; 


const SignUpPage = () => {
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });

  const [validation, setValidation] = useState({
    emailValid: false,
    nameValid: false,
    surnameValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
    agreedToTerms: false
  });

  const [isRed, setRed] = useState({
    emailValid: false,
    nameValid: false,
    surnameValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
    agreedToTerms: false
  });

  const [passwordMatch ,setPasswordMatch] = useState(true);


  const [formSubmitted, setFormSubmitted] = useState(false);


  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type !== 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked
      }));
      if(checked){
        validation.agreedToTerms = true;
      } else {
        validation.agreedToTerms = false;
      }
    }
    switch (name) {
      case "email":
        const emailRegex = /\S+@\S+\.\S+/;
        setValidation(prevState => ({
          ...prevState,
          emailValid: emailRegex.test(value)
        }));
        break;
      case "name":
      case "surname":
        setValidation(prevState => ({
          ...prevState,
          [`${name}Valid`]: value.length >= 3 && value.length <= 16
        }));
        break;
      case "password":
        const isValidPassword = value.length >= 8 && value.length <= 16 && /\d/.test(value) && /[a-zA-Z]/.test(value);
        setValidation(prevState => ({
          ...prevState,
          passwordValid: isValidPassword
        }));
        break;
      case "confirmPassword":
        setValidation(prevState => ({
          ...prevState,
          confirmPasswordValid: value === formData.password
        }));
        break;
      default:
        break;
    }
  };

  const handleFieldClick = (fieldName) => {
    console.log(validation);
    switch (fieldName) {
      case "email":
        setRed(prevState => ({
          ...prevState,
          emailValid: false
        }));
        break;
      case "name":
      case "surname":
        setRed(prevState => ({
          ...prevState,
          [`${fieldName}Valid`]: false
        }));
        break;
      case "password":
        setRed(prevState => ({
          ...prevState,
          passwordValid: false
        }));
        break;
      case "confirmPassword":
        setRed(prevState => ({
          ...prevState,
          confirmPasswordValid: false
        }));
        break;
      default:
        break;
    }
    
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/ac879f6dbd5e22e7024a03fa83c96b1953fb078244fa54362febd476fbca7799?apiKey=76bc4e76ba824cf091e9566ff1ae9339&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/ac879f6dbd5e22e7024a03fa83c96b1953fb078244fa54362febd476fbca7799?apiKey=76bc4e76ba824cf091e9566ff1ae9339&",
    "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg"
  ];
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);


  const switchVisible = (e) => {
    setVisible(!visible);
  }
  const switchVisibleConfirm = (e) => {
    setVisibleConfirm(!visibleConfirm);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let isEmailValid = true;
    setFormSubmitted(true);
    for (const [name, value] of Object.entries(formData)) {
      switch (name) {
        case "email":
          const emailResponse = await checkNewByEmail(value);
          if(emailResponse.length > 0){
            toast.error('User with this email already exists.');
            isEmailValid = false;
            break;
          } else {
            const emailRegex = /\S+@\S+\.\S+/;
            setRed(prevState => ({
              ...prevState,
              emailValid: !emailRegex.test(value)
            }));
            break;
          }
        case "name":
        case "surname":
          setRed(prevState => ({
            ...prevState,
            [`${name}Valid`]: !(value.trim().length >= 3 && value.trim().length <= 16)
          }));
          break;
        case "password":
          const isValidPassword = value.length >= 8 && value.length <= 16 && /\d/.test(value) && /[a-zA-Z]/.test(value);
          setRed(prevState => ({
            ...prevState,
            passwordValid: !isValidPassword
          }));
          break;
        case "confirmPassword":
          setRed(prevState => ({
            ...prevState,
            confirmPasswordValid: !(value === formData.password)
          }));
          break;
        default:
          break;
      }
    }
    for (const key in validation) {
      if (!validation[key]) {
        console.log(key);
        isValid = false;
        break;
      }
    }
    if(!isEmailValid) {
      return;
    }
    if (!isValid) {
      toast.error('The provided data is incorrect.');
      return;
    }
    try{
      await registration({
        email: formData.email,
        first_name: formData.name,
        last_name: formData.surname,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });
            
      toast.success('You have successfully registered!');
      window.location.href = "../login";
    } catch (error) {
      toast.error(error);
    }
    // try {
    //   let code = '';
    //   const characters = '0123456789';
    //   const charactersLength = characters.length;
    //   for (let i = 0; i < 8; i++) {
    //     code += characters.charAt(Math.floor(Math.random() * charactersLength));
    //   }
    //   await confirmationEmail({confirmationCode: code, email: formData.email});
    //   const registration_data = localStorage.getItem('registration_data');
    //   if(registration_data != null) {
    //     localStorage.removeItem('registration_data');
    //   }
    //   await registration({
    //     email: formData.email,
    //     first_name: formData.name,
    //     last_name: formData.surname,
    //     password: formData.password,
    //     confirm_password: formData.confirmPassword,
    //   });
      // localStorage.setItem('registration_data', JSON.stringify(dataToStore));

    //   window.location.href = "../login";
    // } catch (error) {
    //   setLoading(false);
    //   console.error('Registration failed:', error);
    // }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
    <MainContainer>
      <Header>
        <Logo src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
        <BrandName>KaizenCloud</BrandName>
      </Header>
      <ContentWrapper>
        <SignInForm onSubmit={handleSubmit}>
          <Title>Sign up to your account</Title>
          <SubTitle>Welcome! Enter the data required in the screen:</SubTitle>
          <InputOption >
              <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee4214162733dba192ba3af17c7d29b632759c9375d65612bdc4c45e5f640e30?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Email Icon" />
              <OptionText>
              <input
                style={{ backgroundColor: (formSubmitted && isRed.emailValid) ? '#FAA0A0' : 'transparent' }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                onClick={() => handleFieldClick('email')} // Add onClick to reset validation
                required
              />
              </OptionText>
            </InputOption>
            <InputOption>
        <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e09adebadfb46122808d775be9dae444fe08f55ff22730a48bd606a1331052f?apiKey=f933b1b419864e2493a2da58c5eeea0a&" alt="Password Icon" />
        <OptionText>
          <input
            style={{ backgroundColor: (formSubmitted && isRed.nameValid) ? '#FAA0A0' : 'transparent' }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            onClick={() => handleFieldClick('name')}
            required
          />
        </OptionText>
        <Divider />
        <OptionText>
            <input
              style={{ backgroundColor: (formSubmitted && isRed.surnameValid) ? '#FAA0A0' : 'transparent' }}
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Surname"
              onClick={() => handleFieldClick('surname')}
              required
            />
        </OptionText>
      </InputOption>
      <InputOption>
              <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc17cd43c93fe5cd52de4cb4083e202bac1fc58d4dda10fc30e6d313c0287ae3?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Password Icon" />
              <OptionText>
              <input
                style={{ backgroundColor: (formSubmitted && isRed.passwordValid) ? '#FAA0A0' : 'transparent' }}
                type={visible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                onClick={() => handleFieldClick('password')}
                required
              />
              </OptionText>
              <VisibilityOn onClick={switchVisible} style={{ display: visible ? 'none' : 'block' }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/></svg>
              </VisibilityOn>
              <VisibilityOff onClick={switchVisible} style={{ display: visible ? 'block' : 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z"/></svg>
              </VisibilityOff>
            </InputOption>
            <InputOption>
              <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc17cd43c93fe5cd52de4cb4083e202bac1fc58d4dda10fc30e6d313c0287ae3?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Password Icon" />
              <OptionText>
              <input
              style={{ backgroundColor: (formSubmitted && isRed.confirmPasswordValid) ? '#FAA0A0' : 'transparent' }}
              type={visibleConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              onClick={() => handleFieldClick('confirmPassword')}
              required
            />
              </OptionText>
              <VisibilityOn onClick={switchVisibleConfirm} style={{ display: visibleConfirm ? 'none' : 'block' }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/></svg>
              </VisibilityOn>
              <VisibilityOff onClick={switchVisibleConfirm} style={{ display: visibleConfirm ? 'block' : 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z"/></svg>
              </VisibilityOff>
            </InputOption>
            <OptionWrapper>
              <CheckboxWrapper>
                <StyledCheckbox
                  id="agree-to-terms"
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agree-to-terms">
                  I agree to the <a href="/policy">Terms of Uses, Privacy Policy</a>
                </label>
              </CheckboxWrapper>
            </OptionWrapper>
            <SignInButton type="submit" style={{padding: 10}} >Sign up</SignInButton>
          <OptionWrapper>
            <CheckboxWrapper>
            </CheckboxWrapper>
          </OptionWrapper>
          <AccountActions>
            Already have an account? {" "}
            <CreateAccountLink href="../login">Sign in</CreateAccountLink>
          </AccountActions>
        </SignInForm>
        <PromoSection>
        <TransitionGroup style={{textAlign: 'center'}}>
        <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/rus5F7OnUjE"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        ></iframe>
        </TransitionGroup>
          <PromoTitle>Find like-minded innovators like you</PromoTitle>
          <PromoText>Share your ideas and promote them together with colleagues.</PromoText>
        </PromoSection>
      </ContentWrapper>
    </MainContainer>
    <Toaster 
      toastOptions={{
        error: {
          duration: 1000,
        },
      }}
    />
    </>
  );
};

const MainContainer = styled.main`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 90px 50px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledCheckbox = styled.input`
  appearance: none;
  border: 3px solid #c6c6c6;
  border-radius: 10%;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
  border-color:#2973B9;
  padding: 5px;
  position: relative;
  width: 20px;
  height: 20px;


  &:checked::after {
    content: '✔';
    color: #2973B9;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
`;


const Header = styled.header`
  align-self: start;
  display: flex;
  margin-left: 10px;
  gap: 16px;
  font-size: 20px;
  color: #696969;
  font-weight: 400;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: #ccc;
  margin: 2 10px;
`;

const Logo = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const BrandName = styled.h3`
  font-family: Roboto, sans-serif;
  align-self: start;
  flex-grow: 1;
`;

const ContentWrapper = styled.section`
  align-self: end;
  display: flex;
  width: 1184px;
  max-width: 100%;
  justify-content: space-between;
  gap: 250px;
  margin: 50px 54px 0 0;
  @media (max-width: 991px) {
    flex-wrap: wrap;
    margin: 40px 10px 0 0;
  }
`;

const SignInForm = styled.form`
form button:last-child {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: #2b79c2;
  margin-top: 40px;
  color: #fff;
  cursor: pointer;
  font: 400 16px Roboto, sans-serif;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
  button {
    border: none;
    padding: 10px 20px;
    color:white;
    cursor:pointer;
    background-color:transparent;
    @media (max-width: 991px) {
      padding: 10px 30px;
    }
  }
  &:hover {
    background-color: #1d5a96; /* Изменение цвета при наведении */
  }

  /* Добавьте обработчик событий по вашему выбору */
  &:active {
    background-color: #144276; /* Изменение цвета при активации */
  }
}
`;

const Title = styled.h2`
  color: #4a4a4a;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font: 700 25px Roboto, sans-serif;
`;

const SubTitle = styled.p`
  color: #707070;
  margin-top: 40px;
  margin-bottom: 30px;
  white-space: nowrap;
  font: 400 19px Roboto, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const VisibilityOff = styled.div`
  display: none;
  cursor: pointer;
`;
const VisibilityOn = styled.div`

  cursor: pointer;
`;
const InputOption = styled.div`
  border-radius: 6px;
  background-color: #f4faff;
  display: flex;
  align-items: center;
  &:nth-of-type(2) {
    margin-top: 10px;
  }

  &:nth-of-type(3) {
    margin-top: 10px;
  }

  &:nth-of-type(4) {
    margin-top: 10px;
  }

  justify-content: space-between;
  gap: 10px;
  font-size: 15px;
  color: #5d5d5d;
  font-weight: 400;
  padding: 10px 11px;
  @media (max-width: 991px) {
    margin-top: 40px;
    white-space: initial;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    padding: 5px;
    ::placeholder {
      color: #5d5d5d; /* Цвет placeholder'а */
    }
  }
`;

const Icon = styled.img`
  object-fit: contain;
  width: 16px;
`;

const OptionText = styled.span`
  background-color: transparent;
  flex-grow: 1;
`;

const OptionWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  font-size: 14px;
`;


const SignInButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: #2b79c2;
  border:none;
  margin-top: 40px;
  color: #fff;
  cursor: pointer;
  font: 400 16px Roboto, sans-serif;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
  button {
    border: none;
    padding: 10px 20px;
    color:white;
    cursor:pointer;
    background-color:transparent;
    @media (max-width: 991px) {
      padding: 10px 30px;
    }
  }
  &:hover {
    background-color: #1d5a96; /* Изменение цвета при наведении */
  }

  /* Добавьте обработчик событий по вашему выбору */
  &:active {
    background-color: #144276; /* Изменение цвета при активации */
  }
`;


const DividerWithText = styled.div`
 display: flex;
  align-items: center;
  gap: 17px;
  font-size: 16px;
  color: #4f4f4f;
  font-weight: 300;
  text-align: center;
  margin-top: 20px;
  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    border-bottom: 1px solid #989898;
  }

  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;


const GoogleSignIn = styled.div`
  display: flex;
  margin-top: 30px;
  border-radius: 6px;
  border: 1px solid #2b79c2;
  gap: 20px;
  font-size: 19px;
  color: #8b8b8b;
  font-weight: 400;
  padding: 10px 60px;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 6px 20px;
  }
  &:hover {
    background-color: #FAF9F6; /* Изменение цвета при наведении */
  }
`;

const PromoSection = styled.aside`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  align-items: center;
  white-space: nowrap;
  @media (max-width: 991px) {
    max-width: 100%;
    white-space: initial;
  }
`;

const PromoImage = styled.img`
  aspect-ratio: 1.2;
  object-fit: contain;
  width: 85%;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const PromoTitle = styled.h3`
  color: #292828;
  text-align: center;
  margin-top: 20px;
  font: 400 20px Roboto, sans-serif;
`;

const PromoText = styled.p`
  color: #4c4c4c;
  margin-top: 10px;
  font: 300 14px Roboto, sans-serif;
  
`;


const AccountActions = styled.div`
  color: #2b79c2;
  flex-grow: 1;
  font: 400 16px Roboto, sans-serif;
  color: #707070;
  margin-top:20px;
  text-align: center;
  white-space: nowrap;
  font: 400 19px Roboto, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const CreateAccountLink = styled.a`
  color: #2b79c2;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top:10px;
  gap: 15px;
`;

const SocialIcon = styled.button`
  border:none;
  background-color: #acdbfd;
  cursor:pointer;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  &:hover {
    background-color: #00A5E0;
  }
`;

export default SignUpPage;