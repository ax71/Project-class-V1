/**
 * Progress Calculator Utilities
 * 
 * LocalStorage helpers for tracking viewed materials.
 * Note: Progress percentage calculation is now handled by the backend.
 */

/**
 * Get viewed materials for a course from localStorage
 * 
 * @param courseId - The course ID
 * @returns Array of material IDs that have been viewed
 */
export function getViewedMaterials(courseId: number): number[] {
  if (typeof window === "undefined") return [];
  
  const key = `course_${courseId}_materials`;
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save viewed materials for a course to localStorage
 * 
 * @param courseId - The course ID
 * @param materialIds - Array of material IDs that have been viewed
 */
export function saveViewedMaterials(
  courseId: number,
  materialIds: number[]
): void {
  if (typeof window === "undefined") return;
  
  const key = `course_${courseId}_materials`;
  localStorage.setItem(key, JSON.stringify(materialIds));
}

/**
 * Mark a material as viewed
 * 
 * @param courseId - The course ID
 * @param materialId - The material ID to mark as viewed
 * @returns true if material was newly marked, false if already viewed
 */
export function markMaterialAsViewed(
  courseId: number,
  materialId: number
): boolean {
  const viewedMaterials = getViewedMaterials(courseId);
  
  if (viewedMaterials.includes(materialId)) {
    return false; // Already viewed
  }
  
  const updated = [...viewedMaterials, materialId];
  saveViewedMaterials(courseId, updated);
  return true; // Newly marked
}

/**
 * Check if a material has been viewed
 * 
 * @param courseId - The course ID
 * @param materialId - The material ID to check
 * @returns true if material has been viewed
 */
export function isMaterialViewed(
  courseId: number,
  materialId: number
): boolean {
  const viewedMaterials = getViewedMaterials(courseId);
  return viewedMaterials.includes(materialId);
}
