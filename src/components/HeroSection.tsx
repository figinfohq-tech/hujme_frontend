import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Calendar } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-kaaba.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

const HeroSection = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [state, setState] = useState([]);
  const [cities, setCities] = useState([]);
  const [travelType, setTravelType] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedTravelTypeId, setSelectedTravelTypeId] = useState<string>("");
  const [detectedStateName, setDetectedStateName] = useState("");
  const [errors, setErrors] = useState({
    country: false,
    state: false,
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchCountries();
    fetchTravelType();
  }, []);
  
  useEffect(() => {
    if (selectedCountryId) {
      fetchStates();
    }
  }, [selectedCountryId]);
  useEffect(() => {
    if (selectedStateId) {
      fetchCities();
    }
  }, [selectedStateId]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}countries`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchTravelType = async () => {
    try {
      const response = await axios.get(`${baseURL}lookups/TRAVEL_TYPE`);
      setTravelType(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        `${baseURL}states/byCountry/${selectedCountryId}`
      );
      setState(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const fetchCities = async () => {
    try {
      const response = await axios.get(
        `${baseURL}cities/byState/${selectedStateId}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  const handleSearch = () => {
    const newErrors = {
      country: !selectedCountryId,
      state: !selectedStateId,
    };

    setErrors(newErrors);

    if (newErrors.country || newErrors.state) {
      return;
    }

    if (role === "AGENT") {
      navigate("/dashboard/search", {
        state: {
          countryId:selectedCountryId,
          stateId: selectedStateId,
          cityId: selectedCityId,
          travelTypeId: selectedTravelTypeId,
        },
      });
    } else {
      token
      ? navigate("/customer/search", {
        state: {
          stateId: selectedStateId,
          cityId: selectedCityId,
          travelTypeId: selectedTravelTypeId,
        },
      })
      : navigate("/search", {
        state: {
              countryId:selectedCountryId,
              stateId: selectedStateId,
              cityId: selectedCityId,
              travelTypeId: selectedTravelTypeId,
            },
          });
    }
  };

  // user location fatching
  const detectUserLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await getCountryStateFromLatLng(latitude, longitude);
      },
      (error) => {
        console.error("Location access denied", error);
      }
    );
  };

  const getCountryStateFromLatLng = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client`,
        {
          params: {
            latitude: lat,
            longitude: lng,
            localityLanguage: "en",
          },
        }
      );

      const countryName = res.data.countryName;
      const stateName = res.data.principalSubdivision;

      autoSelectCountryState(countryName, stateName);
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    }
  };

  const autoSelectCountryState = (countryName, stateName) => {
    const matchedCountry = countries.find(
      (c) => c.countryName.toLowerCase() === countryName.toLowerCase()
    );

    if (matchedCountry) {
      setSelectedCountryId(matchedCountry.countryId);
      setDetectedStateName(stateName);
      setErrors((prev) => ({ ...prev, country: false }));
    }
  };

  useEffect(() => {
    if (state.length > 0 && detectedStateName) {
      const matchedState = state.find(
        (s) => s.stateName.toLowerCase() === detectedStateName.toLowerCase()
      );

      if (matchedState) {
        setSelectedStateId(matchedState.stateId);
        setErrors((prev) => ({ ...prev, state: false }));
      }
    }
  }, [state, detectedStateName]);

  useEffect(() => {
    if (countries.length > 0) {
      detectUserLocation();
    }
  }, [countries]);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/*  Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/*  Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
            Find Trusted Travel Agents for Hajj & Umrah
          </h1>

          {/*  Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover verified travel agents, compare packages, and book your
            spiritual journey with confidence.
          </p>

          {/*  Search Card */}
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-elegant p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* State */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-700" />
                  Country
                </label>
                <Select
                  value={selectedCountryId}
                  onValueChange={(value) => {
                    setSelectedCountryId(value);
                    setErrors((prev) => ({
                      ...prev,
                      country: false,
                    }));
                  }}
                >
                  <SelectTrigger
                    className={`w-full text-gray-700 border ${
                      errors.country
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((items) => {
                      return (
                        <SelectItem
                          key={items.countryId}
                          value={items.countryId}
                        >
                          {items.countryName}
                        </SelectItem>
                      );
                    })}
                    {/* <SelectItem value="delhi">Delhi</SelectItem> */}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-xs text-red-500">Country is required</p>
                )}
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-700" />
                  State
                </label>
                <Select
                  value={selectedStateId}
                  onValueChange={(value) => {
                    setSelectedStateId(value);
                    // reset city when state changes
                    setSelectedCityId("");
                    setErrors((prev) => ({
                      ...prev,
                      state: false,
                    }));
                  }}
                >
                  <SelectTrigger
                    className={`w-full text-gray-700 border ${
                      errors.state
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.map((items) => {
                      return (
                        <SelectItem key={items.stateId} value={items.stateId}>
                          {items.stateName}
                        </SelectItem>
                      );
                    })}
                    {/* <SelectItem value="delhi">Delhi</SelectItem> */}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">State is required</p>
                )}
              </div>

              {/* Departure City */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-700" />
                  City
                </label>
                <Select
                  onValueChange={(value) => {
                    setSelectedCityId(value);
                  }}
                >
                  <SelectTrigger className="w-full text-gray-700 border-gray-300 focus:ring-green-700 focus:border-green-700">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((items) => {
                      return (
                        <SelectItem key={items.cityId} value={items.cityId}>
                          {items.cityName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Travel Type */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-700" />
                  Travel Type
                </label>
                <Select
                  onValueChange={(value) => {
                    setSelectedTravelTypeId(value);
                  }}
                >
                  <SelectTrigger className="w-full text-gray-700 border-gray-300 focus:ring-green-700 focus:border-green-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelType.map((items) => {
                      return (
                        <SelectItem value={items.lookupName}>
                          {items.lookupName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*  Search Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
