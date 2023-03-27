// import { useRouter } from 'next/router';
// import AlbumDetails from '../../components/AlbumDetails';

// function AlbumPage() {
//     const router = useRouter();
//     const { id } = router.query;
//     async function getAverage(album_id) {
//         try {
//             var response = await fetch(
//                 "http://localhost:5000/spotify/averageRating",
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         album_id: album_id,
//                     },
//                 }
//             );
//             const data = await response.json();
//             const value = data.data;

//             return value;
//         } catch (error) {
//             console.error(error);
//             return null;
//         }
//     }

//     async function getData() {
//         try {
//             const albumData = JSON.parse(localStorage.getItem("albumData"));
//             console.log(albumData);
//             if (!albumData) {
//                 throw new Error("Album data not found");
//             }
//             const averageVal = localStorage.getItem("averageVal");
//             // AVERAGE = averageVal === null ? 0 : averageVal;
//             AVERAGE = averageVal === null ? 0 : parseInt(averageVal);
//             const user = JSON.parse(localStorage.getItem("user"));
//             console.log(user);
//             if (!user) {
//                 throw new Error("User data not found");
//             }
//             const avg = await getAverage(albumData.id);
//             setAlbumData(albumData);
//             console.log(albumData);
//             return albumData;
//         } catch (error) {
//             console.error(error);
//             // Router.push("/home");
//         }
//     }

//     const [albumData, setData] = useState();

//     useEffect(() => {
//         setData(getData());
//     }, []);

//     return (
//         <div>
//             <AlbumDetails album={albumData} />
//         </div>
//     );
// }

// export default AlbumPage;
