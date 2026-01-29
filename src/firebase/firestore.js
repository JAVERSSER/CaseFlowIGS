import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const CASES_COLLECTION = 'cases';

// Create a new case
export const createCase = async (caseData) => {
  try {
    const docRef = await addDoc(collection(db, CASES_COLLECTION), {
      ...caseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating case:', error);
    return { success: false, error: error.message };
  }
};

// Get all cases
export const getCases = async () => {
  try {
    const q = query(collection(db, CASES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const cases = [];
    querySnapshot.forEach((doc) => {
      cases.push({
        caseId: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JS Dates
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        startDate: doc.data().startDate,
        endDate: doc.data().endDate,
      });
    });
    return { success: true, data: cases };
  } catch (error) {
    console.error('Error getting cases:', error);
    return { success: false, error: error.message };
  }
};

// Get a single case by ID
export const getCase = async (caseId) => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: {
          caseId: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        }
      };
    } else {
      return { success: false, error: 'Case not found' };
    }
  } catch (error) {
    console.error('Error getting case:', error);
    return { success: false, error: error.message };
  }
};

// Update a case
export const updateCase = async (caseId, updates) => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating case:', error);
    return { success: false, error: error.message };
  }
};

// Delete a case
export const deleteCase = async (caseId) => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting case:', error);
    return { success: false, error: error.message };
  }
};

// Search cases by title
export const searchCasesByTitle = async (searchTerm) => {
  try {
    const casesResult = await getCases();
    if (!casesResult.success) return casesResult;
    
    const filtered = casesResult.data.filter(c =>
      c.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { success: true, data: filtered };
  } catch (error) {
    console.error('Error searching cases:', error);
    return { success: false, error: error.message };
  }
};

// Filter cases by status
export const filterCasesByStatus = async (status) => {
  try {
    const q = query(
      collection(db, CASES_COLLECTION),
      where('caseStatus', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const cases = [];
    querySnapshot.forEach((doc) => {
      cases.push({
        caseId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      });
    });
    return { success: true, data: cases };
  } catch (error) {
    console.error('Error filtering cases:', error);
    return { success: false, error: error.message };
  }
};