import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetSignupState } from '../../redux/signupSlice';
import { RootState, AppDispatch } from '../../redux/store';
import axios from 'axios';

interface SignupValues {
    user_type: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    country: Country;
}

interface Country {
    name: string;
}

// Define the structure of the API response
interface APIResponseCountry {
    name: {
        common: string;
    };
    flags: {
        png: string;
    };
}

const Signup: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector((state: RootState) => state.signup);

    const [countries, setCountries] = useState<Country[]>([]);

    // Fetch country data from Rest Countries API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get<APIResponseCountry[]>('https://restcountries.com/v3.1/all');
                const countryData = response.data.map((country) => ({
                    name: country.name.common,
                }));
                setCountries(countryData);
            } catch (err) {
                console.error('Error fetching countries:', err);
            }
        };
        fetchCountries();
    }, []);

    const onSubmit = (data: SignupValues) => {
        dispatch(signupUser(data));
    };

    useEffect(() => {
        return () => {
            dispatch(resetSignupState());
        };
    }, [dispatch]);

    return (
        <div className='form-container'>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success ? (
                <p style={{ color: "green" }}>Signup Successful</p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <label htmlFor="user_type">User Type</label>
                        <select {...register('user_type', { required: 'User Type is required' })} >
                            <option value="">Select User Type</option>
                            <option value="researcher">Researcher</option>
                            <option value="investor">Investor</option>
                            <option value="institution_staff">Institution Staff</option>
                            <option value="service_provider">Service Provider</option>
                        </select>
                        {errors.user_type && <p style={{ color: 'red' }}>{errors.user_type.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="first_name">First Name</label>
                        <input type="text" {...register('first_name', { required: 'First Name is required' })} />
                        {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" {...register('last_name', { required: 'Last Name is required' })} />
                        {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="username">Username</label>
                        <input type="text" {...register('username', { required: 'Username is required' })} />
                        {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input type="text" {...register('email', { required: 'Email is required' })} />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor="country">Country</label>
                        <select {...register('country', { required: 'Country is required' })}>
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country.name} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                        {errors.country && <p style={{ color: 'red' }}>{errors.country.message}</p>}
                    </div>
                    <button type='submit' disabled={loading}>
                        {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Signup;
