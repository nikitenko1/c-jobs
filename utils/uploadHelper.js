export const uploadFile = async (files, type) => {
  const images = [];

  for (const file of files) {
    const formData = new FormData();

    formData.append('file', file);
    type === 'avatar'
      ? formData.append('upload_preset', 'jobs_avatar')
      : type === 'cv'
      ? formData.append('upload_preset', 'jobs_cv')
      : type === 'category'
      ? formData.append('upload_preset', 'jobs_category')
      : formData.append('upload_preset', '');
    formData.append('cloud_name', `${process.env.NEXT_PUBLIC_CLOUD_NAME}`);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      images.push(data.secure_url);
    } catch (err) {
      console.log(err);
    }
  }

  return images;
};
