import "../../styles/subFunction/SubFunctionTabs.css";

const SubFunctionTabs = ({ subFunctions, activeTab, onTabClick, exportNode }) => {
  return (
    <div className="sf-tabs-row">
      <div className="sf-tabs-scroll">
        {subFunctions.map((sf) => (
          <button
            key={sf._id}
            className={`sf-tab ${activeTab === sf._id ? "active" : ""}`}
            onClick={() => onTabClick(sf._id)}
          >
            {sf.name}
          </button>
        ))}
      </div>
      {exportNode}
    </div>
  );
};

export default SubFunctionTabs;
