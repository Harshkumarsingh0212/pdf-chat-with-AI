import { useState } from "react";
import api from '../api'
import file_up_icon from '../file_up_icon.png'

function FileForm(){
    const [loader, setLoader] = useState(false);
    const [files, setFiles] = useState([]);
    const handleFileInputChange = async (event) => {
        // console.log(event.target.files)

        const formdata = new FormData();
        Array.from(event.target.files).forEach(file => {
            formdata.append('file_uploads',file);
        });

        try{
            setLoader(true);
            const response = await api.post('/uploadfile/',formdata);
            setLoader(false);
            console.log('files uploaded', response);
            const fileChosen = document.getElementById('file_chosen');
            fileChosen.innerHTML = "";
            const img = new Image();
            img.src=file_up_icon;
            fileChosen.appendChild(img);
            const span = document.createElement("span");
            span.textContent = "  "+ response.data.filenames
            fileChosen.appendChild(span);
        }
        catch(error){
            console.log(error);
        }
    }
    
    return(
        <nav class="navbar">
                <div class="left-nav">                
                    <img id="ai_planet_logo" src="https://framerusercontent.com/images/aH0aUDpSiUrVC1nwJAwiUCXUtU.svg"></img>
                </div>
                {/* <img src={file_up_icon}/> */}
                <div class="middle-nav">
                    <p id="file_chosen"></p>
                </div>
                <div class="right-nav">
                    <div class="over">
                        <input id='file_input' type="file" onChange={handleFileInputChange} hidden multiple/>
                    </div>
                    <div class="under">       
                        <label id="file_label" for="file_input">
                            <i class="bi bi-plus-circle"></i>
                            {loader &&
                                <div class="spinner-border text-secondary" role="status"></div>
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