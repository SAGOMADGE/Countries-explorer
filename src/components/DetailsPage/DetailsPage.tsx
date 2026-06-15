import { useParams } from 'react-router-dom';

import { getCountryByCode } from '@/services/countries';
import { CountryDetails } from '@/types/countryDetails.types';
import { useFetch } from '@/hooks/useFetch';

export const DetailsPage = () => {
  const { cca3 } = useParams();

  if (!cca3) throw new Error('cca3 is missing');

  const {
    data: country,
    loading,
    error,
  } = useFetch<CountryDetails>((signal) => getCountryByCode(cca3, signal));

  if (loading) return <p>Loading...</p>;

  if (!country) return null;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="countryPage">
      <h1>{country.name.official}</h1>

      <p>Столица: {country.capital.join(', ')}</p>

      <p>Население: {country.population}</p>

      <p>Регион: {country.region}</p>

      <img src={country.flags.svg} alt={country.flags.alt} />

      {Object.values(country.languages).map((language) => (
        <p key={language}>Язык: {language}</p>
      ))}

      <strong>
        Currencies:
        {Object.values(country.currencies).map((currency) => (
          <p key={currency.name}>
            {currency.name} {currency.symbol}
          </p>
        ))}
      </strong>
    </div>
  );
};
