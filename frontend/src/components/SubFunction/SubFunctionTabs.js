import "../../styles/subFunction/SubFunctionTabs.css";

const SubFunctionTabs = ({ subFunctions, activeTab, onTabClick, onDelete, exportNode }) => {
  return (
    <div className="sf-tabs-row">
      <div className="sf-tabs-scroll">
        {subFunctions.map((sf) => (
          <div key={sf._id} className={`sf-tab ${activeTab === sf._id ? "active" : ""}`}>
            <button className="sf-tab-btn" onClick={() => onTabClick(sf._id)}>{sf.name}</button>
            <button className="sf-tab-del" onClick={() => onDelete(sf._id)} title="Delete">×</button>
          </div>
        ))}
      </div>
      {exportNode}
    </div>
  );
};

export default SubFunctionTabs;
