import { Place, FilterType } from '../types';

export interface RandomFilterParams {
  filterType: FilterType;
  district?: string;
  excludeId?: string;
}

export class RandomService {
  /**
   * Filter places based on active status, filter category, and optional district
   */
  static filterPlaces(places: Place[], params: RandomFilterParams): Place[] {
    const { filterType, district, excludeId } = params;

    return places.filter((place) => {
      // Must be active
      if (!place.isActive) return false;

      // Avoid repeating the immediately previous place if there are other candidates
      if (excludeId && places.length > 1 && place.id === excludeId) {
        return false;
      }

      // District filter
      if (district && district !== 'ทั้งหมด') {
        if (!place.district.includes(district)) return false;
      }

      // Filter category
      switch (filterType) {
        case 'all':
          return true;

        case 'popular':
          return place.popular === true || place.popularityScore >= 80;

        case 'beach':
          return (
            place.category.includes('ทะเล / ชายหาด') ||
            place.category.includes('เกาะ') ||
            place.tags.some((t) => ['beach', 'sea', 'coast', 'หาด'].includes(t.toLowerCase()))
          );

        case 'island':
          return (
            place.category.includes('เกาะ') ||
            place.district.includes('เกาะ') ||
            place.tags.some((t) => t.toLowerCase().includes('island') || t.includes('เกาะ'))
          );

        case 'mall':
          return (
            place.category.includes('ห้าง / Shopping') ||
            place.tags.some((t) => ['mall', 'shopping', 'department store'].includes(t.toLowerCase()))
          );

        case 'food':
          return (
            place.category.includes('ของกิน') ||
            place.category.includes('ตลาด') ||
            place.category.includes('คาเฟ่')
          );

        case 'theme_park':
          return (
            place.category.includes('สวนสนุก / สวนน้ำ') ||
            place.tags.some((t) => ['aquarium', 'zoo', 'water park', 'theme park'].includes(t.toLowerCase()))
          );

        case 'photo':
          return (
            place.category.includes('จุดถ่ายรูป') ||
            place.category.includes('จุดชมวิว') ||
            place.category.includes('คาเฟ่')
          );

        case 'date':
          return (
            place.suitableFor.includes('คู่รัก') ||
            place.category.includes('จุดชมวิว') ||
            place.tags.some((t) => t.toLowerCase().includes('romantic'))
          );

        case 'family':
          return (
            place.suitableFor.includes('ครอบครัว') ||
            place.category.includes('ครอบครัว')
          );

        case 'friends':
          return (
            place.suitableFor.includes('เพื่อน') ||
            place.category.includes('กลางคืน') ||
            place.category.includes('กิจกรรม')
          );

        case 'cafe':
          return place.category.includes('คาเฟ่');

        case 'temple':
          return place.category.includes('วัด / สถานที่ศักดิ์สิทธิ์');

        case 'nature':
          return place.category.includes('ธรรมชาติ');

        default:
          return true;
      }
    });
  }

  /**
   * Pick one random place from the filtered list.
   * Uses weighted randomness favoring popular places while guaranteeing all have a chance.
   */
  static pickRandom(places: Place[], params: RandomFilterParams): Place | null {
    let eligible = this.filterPlaces(places, params);

    // Fallback if no matching places under strict filter
    if (eligible.length === 0) {
      eligible = places.filter((p) => p.isActive);
    }

    if (eligible.length === 0) return null;

    // Pick using uniform random or weighted score
    const randomIndex = Math.floor(Math.random() * eligible.length);
    return eligible[randomIndex];
  }

  /**
   * Get an exciting sequence of place names for the rapid cycling lucky draw animation
   */
  static getCyclingSequence(places: Place[], winner: Place, count = 25): Place[] {
    const active = places.filter((p) => p.isActive && p.id !== winner.id);
    const sequence: Place[] = [];

    for (let i = 0; i < count; i++) {
      if (active.length > 0) {
        const randomItem = active[Math.floor(Math.random() * active.length)];
        sequence.push(randomItem);
      } else {
        sequence.push(winner);
      }
    }

    // End on the winner
    sequence.push(winner);
    return sequence;
  }
}
