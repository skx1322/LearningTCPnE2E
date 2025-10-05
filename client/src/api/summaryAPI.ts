const backend_url = import.meta.env.VITE_BACKEND_URL as string;

export const summaryAPI = {
    chatSocket: {
        url: `${backend_url}ws`
    },
    videoSocket: {
        url: `${backend_url}video`
    }
}

export default backend_url;
