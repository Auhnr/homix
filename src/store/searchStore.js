import { create } from "zustand";
import { getAds } from "../api/ads";

const useSearchStore = create((set, get) => ({
  query: "",
  filters: {
    type: "",
    dealType: "",
    city: "",
    district: "",
    address: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    floor: "",
    totalFloors: "",
  },
  listings: [], // Список объявлений
  filteredListings: [], // Отфильтрованные объявления

  //  Загрузка объявлений из API
  fetchListings: async () => {
    if (get().listings.length > 0) {
      // Если объявления уже загружены, пропускаем загрузку
      return;
    }
    try {
      const res = await getAds();
      set({ listings: res.data, filteredListings: res.data });
    } catch (err) {
      console.error("Ошибка при загрузке объявлений:", err);
    }
  },

  //  Установка поискового запроса
  setQuery: (value) => {
    set({ query: value });
    get().applyFiltersAndSearch();
  },

  //  Установка фильтров
  setFilters: (newFilters) => {
    set({ filters: newFilters });
    get().applyFiltersAndSearch();
  },

  //  Применение поиска и фильтров
  applyFiltersAndSearch: () => {
    const { listings, query, filters } = get();
    const filtered = listings.filter((ad) => {
      const matchesQuery =
        (ad.title && ad.title.toLowerCase().includes(query.toLowerCase())) ||
        (ad.type && ad.type.toLowerCase().includes(query.toLowerCase())) ||
        (ad.city && ad.city.toLowerCase().includes(query.toLowerCase())) ||
        (ad.district &&
          ad.district.toLowerCase().includes(query.toLowerCase())) ||
        (ad.address &&
          ad.address.toLowerCase().includes(query.toLowerCase())) ||
        (ad.description &&
          ad.description.toLowerCase().includes(query.toLowerCase()));
      return matchesQuery && applyFilters(ad, filters);
    });
    set({ filteredListings: filtered });
  },
}));

//  Применение фильтров
const applyFilters = (ad, filters) => {
  const matchesType = filters.type ? ad.type === filters.type : true;
  const matchesDealType = filters.dealType
    ? ad.deal_type === filters.dealType
    : true;
  const matchesCity = filters.city
    ? ad.city.toLowerCase().includes(filters.city.toLowerCase())
    : true;
  const matchesDistrict = filters.district
    ? ad.district &&
      ad.district.toLowerCase().includes(filters.district.toLowerCase())
    : true;
  const matchesAddress = filters.address
    ? ad.address &&
      ad.address.toLowerCase().includes(filters.address.toLowerCase())
    : true;
  const matchesMinPrice = filters.minPrice
    ? parseInt(ad.price.replace(/\D/g, "")) >= parseInt(filters.minPrice)
    : true;
  const matchesMaxPrice = filters.maxPrice
    ? parseInt(ad.price.replace(/\D/g, "")) <= parseInt(filters.maxPrice)
    : true;
  const matchesMinArea = filters.minArea ? ad.area >= filters.minArea : true;
  const matchesMaxArea = filters.maxArea ? ad.area <= filters.maxArea : true;
  const matchesRooms = filters.rooms
    ? ad.rooms === Number(filters.rooms)
    : true;
  const matchesFloor = filters.floor
    ? ad.floor === Number(filters.floor)
    : true;
  const matchesTotalFloors = filters.totalFloors
    ? ad.total_floors === Number(filters.totalFloors)
    : true;

  return (
    matchesType &&
    matchesDealType &&
    matchesCity &&
    matchesDistrict &&
    matchesAddress &&
    matchesMinPrice &&
    matchesMaxPrice &&
    matchesMinArea &&
    matchesMaxArea &&
    matchesRooms &&
    matchesFloor &&
    matchesTotalFloors
  );
};

export default useSearchStore;
export const useFilteredListings = () =>
  useSearchStore((state) => state.filteredListings);
