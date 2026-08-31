  const [name,setName]=useState("Student");
  useEffect(()=>{
    const storedName = localStorage.getItem("matric360_name");
    if(storedName) setName(storedName);
    else {
      const u = localStorage.getItem("matric360_user");
      if(u){ try{ const j=JSON.parse(u); if(j.name) setName(j.name); }catch{} }
    }
  },[]);
