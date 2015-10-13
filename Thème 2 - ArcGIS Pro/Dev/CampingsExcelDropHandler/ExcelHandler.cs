//   Copyright 2015 Esri
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at

//       http://www.apache.org/licenses/LICENSE-2.0

//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License. 

using System;
using System.Threading.Tasks;
using System.Windows;
using ArcGIS.Core.CIM;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Core.Geoprocessing;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.DragDrop;
using ArcGIS.Desktop.Mapping;


namespace CampingsExcelDropHandler
{
    internal class ExcelHandler : DropHandlerBase
    {
        public override void OnDragOver(DropInfo dropInfo)
        {
            dropInfo.Effects = DragDropEffects.All;
        }

        public override void OnDrop(DropInfo dropInfo)
        {

            #region Implement Your OnDrop Here

            if (dropInfo.TargetModel != null)
            {
                if (dropInfo.TargetModel is MapView)
                {
                    MapView view = dropInfo.TargetModel as MapView;

                    // globe or local
                    if (view.ViewingMode == MapViewingMode.SceneGlobal ||
                        view.ViewingMode == MapViewingMode.SceneLocal)
                    {
                        //we are in 3D
                        OnDrop3D(dropInfo);
                    }
                    else
                    {
                        //we are in 2D
                        OnDrop2D(dropInfo);
                    }
                }
            }
            #endregion

            dropInfo.Handled = true;
        }

        private async void OnDrop2D(DropInfo dropInfo)
        {
            #region Create layers for the XLS file 
            String Path = Project.Current.DefaultGeodatabasePath + "\\Campings_FGDB";
            // Delete the feature class "Campings_FGDB" if exists 
            var result = await Geoprocessing.ExecuteToolAsync("management.Delete", new string[] {
            Path, "FeatureClass"});

            // Add the xy event layer layer 
            string xlsLayerName = await CreateTheXYEventLayer(dropInfo);

            // Copy  feature from xy evant layer to the feature class 
            result = await Geoprocessing.ExecuteToolAsync("management.CopyFeatures", new string[] {
            xlsLayerName, Path});
            #endregion

            #region Assign Symbology (from Location layer)
            if (!result.IsFailed)
            {
                String path = Project.Current.HomeFolderPath; 
                // 1st way  execute the geoprocessing
                result = await Geoprocessing.ExecuteToolAsync("management.ApplySymbologyFromLayer", new string[] {
                "Campings_FGDB", path+@"/Symbology2D.lyrx"});

                // 2nd way to execute the geoprocessing
                /*
          
                var valueArray = await QueuedTask.Run(() =>
                {
                    var g = new List<object>() { "Campings_FGDB", };

                    var symbologyLayer = path+@"/Symbology2D.lyrx";

                    return Geoprocessing.MakeValueArray(g, symbologyLayer);
                });
            
                 var result =await Geoprocessing.ExecuteToolAsync("management.ApplySymbologyFromLayer", valueArray);

                */
            }
            #endregion
        }

        private static async Task<string> CreateTheXYEventLayer(DropInfo dropInfo)
        {
            string xlsName = dropInfo.Items[0].Data.ToString();
            string xlsLayerName = Module1.GetUniqueLayerName(xlsName);
            string xlsTableName = null;
            if (xlsName.ToUpper().EndsWith(".CSV"))
            {
                xlsTableName = xlsName;
            }
            else
            {
                string xlsSheetName = Module1.GetUniqueStandaloneTableName(xlsName);
                xlsTableName = xlsName + "\\" + xlsSheetName;
            }

            // set overwrite flag           
            var environments = Geoprocessing.MakeEnvironmentArray(overwriteoutput: true);

            #region Geoprocessing.ExecuteToolAsync(MakeXYEventLayer_management)

            var result = await Geoprocessing.ExecuteToolAsync("MakeXYEventLayer_management", new string[] {
                xlsTableName,
                "X",
                "Y",
                xlsLayerName,
                "WGS_1984"
            }, environments);

            #endregion
            return xlsLayerName;
        }

        private async void OnDrop3D(DropInfo dropInfo)
        {
            String path = Project.Current.HomeFolderPath; 
            string xlsLayerName = await CreateTheXYEventLayer(dropInfo);

            #region await Geoprocessing.ExecuteToolAsync(ApplySymbologyFromLayer_management)

            var result = await Geoprocessing.ExecuteToolAsync("ApplySymbologyFromLayer_management", new string[] {
              xlsLayerName, 
              path+@"/Symbology3D.lyrx"
            });

            #endregion
        }

    }
}
