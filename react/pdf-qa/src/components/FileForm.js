import { useState } from "react";
import api from '../api'
import file_up_icon from '../file_up_icon.png'

function FileForm(){
    const [loader, setLoader] = useState(false);
    const [files, setFiles] = useState([]);

    const handleFileInputChange = async (event) => {
        const formdata = new FormData();
        Array.from(event.target.files).forEach(file => {
            formdata.append('file_uploads', file);
        });

        try{
            setLoader(true);
            const response = await api.post('/uploadfile/', formdata);
            setLoader(false);
            const fileChosen = document.getElementById('file_chosen');
            fileChosen.innerHTML = "";
            const img = new Image();
            img.src = file_up_icon;
            fileChosen.appendChild(img);
            const span = document.createElement("span");
            span.textContent = "  " + response.data.filenames;
            fileChosen.appendChild(span);
        }
        catch(error){
            setLoader(false);
            console.log(error);
            alert("File upload failed. Please make sure the backend server is running and try again.");
        }
    }

    return(
        <nav className="navbar">
            <div className="left-nav">
                <img id="ai_planet_logo" src={file_up_icon} alt="logo" style={{height: '40px'}} />
            </div>
            <div className="middle-nav">
                <p id="file_chosen"></p>
            </div>
            <div className="right-nav">
                <div className="over">
                    <input id='file_input' type="file" onChange={handleFileInputChange} hidden multiple/>
                </div>
                <div className="under">
                    <label id="file_label" htmlFor="file_input">
                        <i className="bi bi-plus-circle"></i>
                        {loader &&
                            <div className="spinner-border text-secondary" role="status"></div>
                        }
                        {!loader &&
                            <p>Upload PDF</p>
                        }
                    </label>
                </div>
            </div>
        </nav>
    )
}

export default FileForm;