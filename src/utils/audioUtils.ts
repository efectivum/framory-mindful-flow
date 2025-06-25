
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const setupAudioAnalyser = (stream: MediaStream) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  
  analyser.fftSize = 256;
  
  return { audioContext, analyser };
};

export const calculateAudioLevel = (analyser: AnalyserNode): number => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  return average / 255;
};

// Optimized audio processing
export const optimizedBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Use arrayBuffer for faster processing
    blob.arrayBuffer()
      .then(buffer => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 0x8000; // 32KB chunks for better performance
        
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        
        resolve('data:audio/webm;base64,' + btoa(binary));
      })
      .catch(reject);
  });
};

// Stream audio processing for real-time chunks
export const processAudioChunk = (chunk: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    chunk.arrayBuffer()
      .then(buffer => {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        resolve(base64);
      })
      .catch(reject);
  });
};
