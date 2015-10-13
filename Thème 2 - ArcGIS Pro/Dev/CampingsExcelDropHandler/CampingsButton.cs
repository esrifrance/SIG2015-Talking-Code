using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Core.Geoprocessing;
using ArcGIS.Core.CIM;
using ArcGIS.Desktop.Core;
using ArcGIS.Core.Data;
using ArcGIS.Core;
using ArcGIS.Desktop.Mapping;

namespace CampingsExcelDropHandler
{
    internal class CampingsButton : Button
    {
        protected override async void OnClick()
        {
            var result = await Geoprocessing.ExecuteToolAsync("analysis.Near", new string[] {
            @"Campings_FGDB", "Hydrographie\\Cours d'eau", "50 Meters", "false", "false", "PLANAR"
            });

            if (result.IsFailed)
            {
                Geoprocessing.ShowMessageBox(result.Messages, "GP Messages", result.IsFailed ? GPMessageBoxStyle.Error : GPMessageBoxStyle.Default);
                return;
            }

            #region Assign Symbology to selected features
            if (!result.IsFailed)
            {

                var campingsLayer = MapView.Active.Map.FindLayers("Campings_FGDB").FirstOrDefault() as BasicFeatureLayer;
                if (campingsLayer != null)
                {
                    await ArcGIS.Desktop.Framework.Threading.Tasks.QueuedTask.Run(() =>
                        campingsLayer.SetDefinitionQuery("NEAR_DIST > -1"));
                }
            }
            #endregion 
           

        }
    }
}
