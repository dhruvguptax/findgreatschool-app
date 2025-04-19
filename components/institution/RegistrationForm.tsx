// components/institution/RegistrationForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';

// Define the shape of our form data
type Inputs = {
  // Basic Info
  institutionName: string;
  type: 'school' | 'coaching' | 'college' | '';
  // Location & Contact
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone?: string;
  // Academic Details
  board?: string;
  feeStructure?: string;
  studentTeacherRatio?: number;
  classesOfferedText?: string;
  examsCoachedText?: string;
  programsOfferedText?: string;
  // Features Checklist
  features?: Record<string, boolean>;
  // Image file input is handled by separate state, not react-hook-form directly
};

interface RegistrationFormProps {
  userId: string;
}

// --- Feature Categories Definition (keep as before) ---
const featureCategories = { /* ... same as before ... */
    'Academic': [
      { key: 'smart_classes', label: 'Smart Classes' },
      { key: 'science_lab', label: 'Science Lab' },
      { key: 'computer_lab', label: 'Computer Lab' },
      { key: 'library', label: 'Library' },
    ],
    'Infrastructure': [
      { key: 'ac_classrooms', label: 'AC Classrooms' },
      { key: 'auditorium', label: 'Auditorium' },
      { key: 'canteen', label: 'Canteen / Cafeteria' },
      { key: 'wifi_campus', label: 'Wi-Fi Campus' },
    ],
    'Sports & Activities': [
      { key: 'playground', label: 'Playground' },
      { key: 'sports_coaching', label: 'Sports Coaching' },
      { key: 'swimming_pool', label: 'Swimming Pool' },
      { key: 'music_room', label: 'Music Room' },
      { key: 'art_craft', label: 'Art & Craft' },
    ],
    'Services': [
      { key: 'transport', label: 'Transport Facility' },
      { key: 'hostel', label: 'Hostel Facility' },
      { key: 'day_care', label: 'Day Care / Creche' },
      { key: 'medical_room', label: 'Medical Room' },
    ],
    'Learning Modes': [
       { key: 'online_classes', label: 'Online Classes Available' },
       { key: 'weekend_batches', label: 'Weekend Batches (Coaching)' },
    ]
};
// --- End Feature Categories ---

// --- Image Dimension Constants ---
const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 600;
// --- End Constants ---


export default function InstitutionRegistrationForm({ userId }: RegistrationFormProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // --- State for SINGLE selected file ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // --- End State ---

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Inputs>({
    defaultValues: { type: '', features: {} }
  });

  const institutionType = watch("type");


  // --- Handler for SINGLE file input change with dimension check ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Clear previous file errors
    setSelectedFile(null); // Clear previous selection state
    const fileInput = event.target;
    const file = fileInput.files?.[0]; // Get the single file

    if (!file) {
      return; // No file selected
    }

    // Basic Type Check
    if (!file.type.startsWith('image/')) {
       setFileError('Please select a valid image file (PNG, JPG, WebP).');
       fileInput.value = ''; // Reset file input
       return;
    }

    // --- Dimension Check ---
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            console.log(`Image dimensions: ${img.width}x${img.height}`);
            if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
                setFileError(`Image dimensions (${img.width}x${img.height}) exceed the maximum allowed (${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}).`);
                setSelectedFile(null); // Clear selection state
                fileInput.value = ''; // Reset the file input visually
            } else {
                // Dimensions are valid, update the state
                setSelectedFile(file); // Store the single valid File object
                setFileError(null); // Clear any previous errors
            }
        };
        img.onerror = () => {
             setFileError('Could not read image dimensions. Please try a different image.');
             setSelectedFile(null);
             fileInput.value = '';
        };
        if (e.target?.result) {
             img.src = e.target.result as string; // Set src for the image object to check dimensions
        } else {
             setFileError('Could not read the file.');
             setSelectedFile(null);
             fileInput.value = '';
        }
    };
    reader.onerror = () => {
         setFileError('Error reading file.');
         setSelectedFile(null);
         fileInput.value = '';
    };
    reader.readAsDataURL(file); // Read the file to get Data URL for Image object
    // --- End Dimension Check ---
  };
  // --- End Handler ---


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setFileError(null);
    console.log("Form Data Submitted (excluding files):", data);

    let imageUrl: string | null = null; // Store single URL

    try {
      // 1. Handle SINGLE Image Upload FIRST
      if (selectedFile) { // Check single file state
        console.log("Starting file upload for:", selectedFile.name);

         // Create unique file path
         const filePath = `${userId}/${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9_.]/g, '_')}`; // Sanitize
         const { data: uploadData, error: uploadError } = await supabase.storage
           .from('institution-images') // Your bucket name
           .upload(filePath, selectedFile);

         if (uploadError) throw uploadError;

         // Get public URL
         if (uploadData) {
           const { data: urlData } = supabase.storage
             .from('institution-images')
             .getPublicUrl(uploadData.path);
           imageUrl = urlData?.publicUrl ?? null;
           if (!imageUrl) console.warn(`Could not get public URL for ${uploadData.path}`);
           console.log("Finished file upload. URL:", imageUrl);
         }
      } else {
         console.log("No file selected for upload.");
      }

      // 2. Prepare data for Supabase insertion
      const classesArray = data.classesOfferedText?.split('\n').filter(Boolean).map(s => s.trim());
      const examsArray = data.examsCoachedText?.split('\n').filter(Boolean).map(s => s.trim());
      const programsArray = data.programsOfferedText?.split('\n').filter(Boolean).map(s => s.trim());

      const institutionData = {
        name: data.institutionName,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone || null,
        board: data.board || null,
        fee_structure: data.feeStructure || null,
        student_teacher_ratio: data.studentTeacherRatio ? Number(data.studentTeacherRatio) : null,
        classes_offered: institutionType === 'school' ? classesArray : null,
        exams_coached: institutionType === 'coaching' ? examsArray : null,
        programs_offered: institutionType === 'college' ? programsArray : null,
        features: data.features || {},
        user_id: userId,
        is_approved: false,
        // Store single URL in the array, or empty array if no image
        images: imageUrl ? [imageUrl] : [], // <-- Store as array with 0 or 1 element
      };

      console.log("Inserting data into database:", institutionData);

      // 3. Insert into Supabase database
      const { error: insertError } = await supabase
        .from('institutions')
        .insert(institutionData);

      if (insertError) throw insertError;

      // Success!
      setSubmitSuccess(true);
      reset();
      setSelectedFile(null); // Clear selected file state
      const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';


    } catch (error: any) {
      console.error("Error during submission process:", error);
      setSubmitError(`Submission failed: ${error.message || 'Unknown error occurred. Check console.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return ( /* ... Success Message Div ... */
       <div className="p-4 text-center bg-green-100 border border-green-300 rounded-md">
            <h3 className="font-semibold text-green-800">Registration Submitted Successfully!</h3>
            <p className="text-sm text-green-700">Your submission is pending review. Thank you!</p>
        </div>
    );
  }

  // --- Render the Form ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{submitError}</p>}
      {fileError && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{fileError}</p>}


      {/* --- Basic Info Section (Same) --- */}
      <fieldset className="border p-4 rounded-md">
         {/* ... name and type inputs ... */}
         <legend className="text-lg font-semibold px-2">Basic Information</legend>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
             <div>
               <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">Institution Name</label>
               <input type="text" id="institutionName" {...register("institutionName", { required: "Institution name is required" })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
               {errors.institutionName && <p className="text-red-500 text-xs mt-1">{errors.institutionName.message}</p>}
             </div>
             <div>
               <label htmlFor="type" className="block text-sm font-medium text-gray-700">Institution Type</label>
               <select id="type" {...register("type", { required: "Please select a type" })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                 <option value="">-- Select Type --</option>
                 <option value="school">School</option>
                 <option value="coaching">Coaching Institute</option>
                 <option value="college">College / University</option>
               </select>
               {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
             </div>
           </div>
      </fieldset>

      {/* --- Location & Contact Section (Same) --- */}
      <fieldset className="border p-4 rounded-md">
           {/* ... address, city, state, pincode, email, phone inputs ... */}
           <legend className="text-lg font-semibold px-2">Location & Contact</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
              <textarea id="address" {...register("address", { required: "Address is required" })} rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
             <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" id="city" {...register("city", { required: "City is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
             <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" id="state" {...register("state", { required: "State is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
             <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="text" id="pincode" {...register("pincode", { required: "Pincode is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
            </div>
             <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" id="contactEmail" {...register("contactEmail", { required: "Contact email is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
            </div>
             <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone </label>
                <input type="tel" id="contactPhone" {...register("contactPhone")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
         </div>
      </fieldset>

      {/* --- Academic Details Section (Same) --- */}
      <fieldset className="border p-4 rounded-md">
          {/* ... board, fee, ratio, classes/exams/programs inputs ... */}
          <legend className="text-lg font-semibold px-2">Academic Details</legend>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {institutionType === 'school' && (
                <div>
                    <label htmlFor="board" className="block text-sm font-medium text-gray-700">Affiliation Board (e.g., CBSE, ICSE)</label>
                    <input type="text" id="board" {...register("board")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            )}
            <div className={institutionType !== 'school' ? 'md:col-span-2' : ''}>
                <label htmlFor="feeStructure" className="block text-sm font-medium text-gray-700">Fee Structure Description</label>
                <textarea id="feeStructure" {...register("feeStructure")} rows={3} placeholder="Describe fees, e.g., 'Tuition: 50k/year, Transport: 5k/month'"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="studentTeacherRatio" className="block text-sm font-medium text-gray-700">Student : Teacher Ratio (Enter student number, e.g., 25 for 25:1)</label>
                <input type="number" id="studentTeacherRatio" {...register("studentTeacherRatio", { valueAsNumber: true, min: 1 })} min="1" step="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                 {errors.studentTeacherRatio && <p className="text-red-500 text-xs mt-1">Please enter a valid number (e.g., 25).</p>}
            </div>
            {institutionType === 'school' && (
                <div className="md:col-span-2">
                    <label htmlFor="classesOfferedText" className="block text-sm font-medium text-gray-700">Classes Offered (Enter one per line)</label>
                    <textarea id="classesOfferedText" {...register("classesOfferedText")} rows={4} placeholder="e.g.&#10;Nursery&#10;LKG&#10;UKG&#10;1&#10;..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            )}
             {institutionType === 'coaching' && (
                <div className="md:col-span-2">
                    <label htmlFor="examsCoachedText" className="block text-sm font-medium text-gray-700">Exams Coached (Enter one per line)</label>
                    <textarea id="examsCoachedText" {...register("examsCoachedText")} rows={4} placeholder="e.g.&#10;JEE Main&#10;NEET&#10;UPSC..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            )}
             {institutionType === 'college' && (
                <div className="md:col-span-2">
                    <label htmlFor="programsOfferedText" className="block text-sm font-medium text-gray-700">Programs/Degrees Offered (Enter one per line)</label>
                    <textarea id="programsOfferedText" {...register("programsOfferedText")} rows={4} placeholder="e.g.&#10;B.Tech CSE&#10;MBA&#10;B.Com..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            )}
        </div>
      </fieldset>

      {/* --- Features Checklist Section (Same) --- */}
      <fieldset className="border p-4 rounded-md">
          {/* ... features checklist rendering ... */}
           <legend className="text-lg font-semibold px-2">Features & Amenities</legend>
           <div className="space-y-4 mt-2">
            {Object.entries(featureCategories).map(([category, items]) => (
                <div key={category}>
                    <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                        {items.map((feature) => (
                            <div key={feature.key} className="flex items-center">
                                <input
                                    id={`feature-${feature.key}`}
                                    type="checkbox"
                                    {...register(`features.${feature.key}`)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`feature-${feature.key}`} className="ml-2 block text-sm text-gray-900">
                                    {feature.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </fieldset>

      {/* --- UPDATED: Single Image Upload Section --- */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-semibold px-2">Upload Primary Image (Max {MAX_IMAGE_WIDTH}x{MAX_IMAGE_HEIGHT}px)</legend>
        <div className="mt-2">
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
                Select ONE Image
            </label>
            <input
                id="imageUpload"
                type="file"
                // REMOVED multiple attribute
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange} // Use the handler with dimension check
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
             {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
             {selectedFile && (
                <div className="mt-2 text-xs text-gray-600">
                    Selected: {selectedFile.name}
                </div>
             )}
        </div>
      </fieldset>
      {/* --- End Image Upload --- */}


      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </form>
  );
}